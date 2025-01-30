# Bedrock Knowledge Base Retrieval

This is a simple example of how to use Bedrock to retrieve information from a knowledge base.

## Background

This is an extension of [another project](https://github.com/chaserx/chroma_langchain_embedding_retrieval) in a series of projects that I'm working on to learn more about Bedrock, Langchain, and RAG.

Except here, I'm using a knowledge base that I created in the Bedrock console that is populated with the same `prizes.json` file that I used in the original project.

The knowledge base used here was created manually in the Bedrock console using S3, the Titan Embeddings model, and the Pinecone Vector Database.

When you run the script, it will ask you to provide a question to ask the knowledge base. The question along with the context of the knowledge base is passed to the Bedrock model and the response is returned. Here's an example of the output:

```plaintext
According to the provided context, Albert Einstein was awarded the Nobel Prize in Physics in 1921 "for his services to Theoretical Physics, and especially for his discovery of the law of the photoelectric effect."
```

## Going further

There is another contrived example of how to use Bedrock to retrieve information from another knowledge base. This variant uses a different data source from a different JSON file stored in a different S3 bucket. This data was generated from a scaffold of fake heavy equipment fleet data that matches the schema of the ISO 15143 standard. It is stored in the `iso-15143-data` bucket. The data generator script that created this data is located in the `support` directory.

To run the script, you can use the following command:

```bash
uv run main.py --env .env.local --question "What is the total distance traveled by the equipment in the dataset?"
```

## Prerequisites

- [uv](https://docs.astral.sh/uv/)
- [python-dotenv](https://pypi.org/project/python-dotenv/)

AWS credentials are required to run the application. Follow instructions [here](https://docs.aws.amazon.com/singlesignon/latest/userguide/howtogetcredentials.html) to set up your credentials.

Access to the Anthropic Bedrock model is required. Follow instructions [here](https://docs.aws.amazon.com/bedrock/latest/userguide/model-access.html) to set up request access from model providers.

Read more about [Langchain AWS](https://python.langchain.com/docs/integrations/providers/aws/)

## Setup

1. Create a `.env` file with the following variables:

- `KNOWLEDGE_BASE_ID`: The ID of the knowledge base to retrieve information from.

1. Install dependencies

```bash
uv sync
```

3. Run the script using uv

```bash
uv run main.py
```

Optionally, you can run the script using `uv run main.py --env .env.local` to use a local `.env.local` file.

Additionally, you use the `--question` flag to specify a question to ask the knowledge base.

```bash
uv run main.py --question "What was the motivation for awarding the Nobel Prize to Albert Einstein?"
```
