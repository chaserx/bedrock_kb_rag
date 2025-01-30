// Helper function to generate random date within a range
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to generate random float within a range
function randomFloat(min, max, decimals = 1) {
    return Number((Math.random() * (max - min) + min).toFixed(decimals));
}

// Generate 10 pieces of equipment
const equipment = Array.from({length: 10}, (_, i) => {
    const currentDate = new Date("2022-06-10T04:14:45Z");
    const operatingHours = randomFloat(5000, 10000, 1);
    const idleHours = operatingHours * randomFloat(0.1, 0.2, 1);
    
    return {
        EquipmentHeader: {
            OEMName: "CAT",
            Model: `M${Math.floor(Math.random() * 1000)}`,
            EquipmentID: `EQ${String(i+1).padStart(3, '0')}`,
            SerialNumber: `SN${Math.floor(Math.random() * 100000)}`
        },
        Location: {
            Latitude: randomFloat(30, 45, 6),
            Longitude: randomFloat(-120, -70, 6),
            Altitude: randomFloat(0, 5000, 3),
            AltitudeUnits: "metre",
            Datetime: currentDate.toISOString()
        },
        CumulativeIdleHours: {
            Hour: idleHours,
            Datetime: currentDate.toISOString()
        },
        CumulativeOperatingHours: {
            Hour: operatingHours,
            Datetime: currentDate.toISOString()
        },
        CumulativePayloadTotals: {
            PayloadUnits: "kilogram",
            Payload: randomFloat(1000000000, 2000000000000, 0),
            Datetime: randomDate(new Date("2020-01-01"), currentDate).toISOString()
        },
        Distance: {
            OdometerUnits: "kilometre",
            Odometer: randomFloat(5000, 15000, 1),
            Datetime: currentDate.toISOString()
        },
        EngineStatus: {
            EngineNumber: `EN${Math.floor(Math.random() * 10000)}`,
            Running: Math.random() > 0.3,
            Datetime: new Date(currentDate.getTime() + 1000*60*7).toISOString()
        },
        FuelUsed: {
            FuelUnits: "litre",
            FuelConsumed: Math.floor(randomFloat(50000, 100000)),
            Datetime: currentDate.toISOString()
        },
        FuelUsedLast24: {
            FuelUnits: "litre",
            FuelConsumed: Math.floor(randomFloat(100, 300)),
            Datetime: new Date(currentDate.getTime() - 1000*60*60*24).toISOString()
        },
        FuelRemaining: {
            Percent: randomFloat(20, 100, 1),
            Datetime: currentDate.toISOString()
        }
    };
});

console.log(JSON.stringify({
    Links: [
        {
            Rel: "Current",
            Href: "https://api.cat.com/telematics/iso15143/fleet/1"
        },
        {
            Rel: "Next",
            Href: "https://api.cat.com/telematics/iso15143/fleet/2"
        },
        {
            Rel: "Last",
            Href: "https://api.cat.com/telematics/iso15143/fleet/2"
        },
        {
            Rel: "First",
            Href: "https://api.cat.com/telematics/iso15143/fleet/1"
        }
    ],
    Equipment: equipment
}, null, 2));