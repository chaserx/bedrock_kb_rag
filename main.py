from dotenv import load_dotenv
from typing import Dict
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_aws import ChatBedrock
from langchain_aws.retrievers import AmazonKnowledgeBasesRetriever

import boto3
import os
import argparse
from typing import Optional


# setup boto3 client
def setup_boto3_client(service_name: str) -> boto3.client:
    return boto3.client(
        service_name=service_name,
        region_name=os.getenv("AWS_REGION", "us-east-1"),
        aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
    )


# setup bedrock chat client
def setup_bedrock_chat_client(
    model_id: str,
    streaming: bool = False,
    max_tokens: int = 4096,
    temperature: float = 0.0,
) -> ChatBedrock:
    """Initialize and return a Bedrock LLM client.

    Returns:
        ChatBedrock: Configured Bedrock client
    """

    return ChatBedrock(
        client=setup_boto3_client("bedrock-runtime"),
        model_id=model_id,
        streaming=streaming,
        model_kwargs={
            "max_tokens": max_tokens,
            "temperature": temperature,
        },
    )

def parse_arguments() -> argparse.Namespace:
    """Parse command line arguments.

    Returns:
        argparse.Namespace: Parsed command line arguments
    """
    parser = argparse.ArgumentParser(
        description="Chat with Claude 3.5 Sonnet via AWS Bedrock"
    )
    parser.add_argument(
        "-q",
        "--question",
        type=str,
        help="Question to ask the LLM",
        default="What was the motivation for awarding the Nobel Prize to Albert Einstein?",
    )
    parser.add_argument(
        "-k",
        "--knowledge-base-id",
        type=str,
        help="Knowledge base ID to use",
        default=os.getenv("KNOWLEDGE_BASE_ID"),
    )
    return parser.parse_args()

def main():
    load_dotenv()

    args = parse_arguments()

    kb_retriever = AmazonKnowledgeBasesRetriever(
        client=setup_boto3_client("bedrock-agent-runtime"),
        knowledge_base_id=args.knowledge_base_id,
        retrieval_config={"vectorSearchConfiguration": {"numberOfResults": 10}},
    )

    docs = kb_retriever.invoke(args.question)

    prompt = ChatPromptTemplate(
        [
            (
                "system",
                """You are a helpful assistant who answers user queries using the contexts provided. 
             If the question cannot be answered using the information provided say 'I don't know'""",
            ),
            ("user", "{question}"),
            ("user", "{context}"),
        ]
    )

    chain = (
        prompt
        | setup_bedrock_chat_client("us.anthropic.claude-3-5-sonnet-20241022-v2:0")
        | StrOutputParser()
    )

    response = chain.invoke({"question": args.question, "context": docs})
    print(response)


if __name__ == "__main__":
    main()
