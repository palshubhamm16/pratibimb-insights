const knownStates = [
    "ANDHRA PRADESH", "ARUNACHAL PRADESH", "ASSAM", "BIHAR", "CHHATTISGARH",
    "GOA", "GUJARAT", "HARYANA", "HIMACHAL PRADESH", "JHARKHAND", "KARNATAKA",
    "KERALA", "MADHYA PRADESH", "MAHARASHTRA", "MANIPUR", "MEGHALAYA", "MIZORAM",
    "NAGALAND", "ODISHA", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL NADU", "TELANGANA",
    "TRIPURA", "UTTAR PRADESH", "UTTARAKHAND", "WEST BENGAL", "DELHI", "JAMMU AND KASHMIR",
    "LADAKH", "CHANDIGARH", "PUDUCHERRY", "DAMAN AND DIU", "ANDAMAN AND NICOBAR", "LAKSHADWEEP"
];

function parseVictimLocation(raw = "") {
    const tokens = raw.trim().split(/\s+/);
    const ackNumber = tokens[0];
    const rest = tokens.slice(1).join(" ").toUpperCase();

    let matchedState = "";
    for (const state of knownStates) {
        if (rest.endsWith(state)) {
            matchedState = state;
            break;
        }
    }

    let district = "";
    if (matchedState) {
        district = rest.slice(0, rest.length - matchedState.length).trim();
    }

    return {
        ackNumber,
        district: district || null,
        state: matchedState || null
    };
}

export default function cleanRow(row) {
    // Coordinates
    const [latStr, lngStr] = (row["Latitude, Longitude"] || "").split(',').map(s => s.trim());
    const latitude = parseFloat(row["Latitude"]) || parseFloat(latStr);
    const longitude = parseFloat(row["Longitude"]) || parseFloat(lngStr);

    // Victim name + phone
    const [victimName, victimPhone] = (row["Victim (Name,Phone No.)"] || "").split(/\s(?=\d{10}$)/);

    // Victim location
    const victimLoc = parseVictimLocation(row["Victim (Acknowledgment No.,District,State)"]);

    // Category + amount
    const matchAmount = row["Category, Fraudulent Amount"]?.match(/^(.*?)\s+of\s+Rs\.?\s*([\d,]+)/i);

    // Date and time (robust)
    let fetchedDate = null;
    let fetchedTime = null;
    const fetchedRaw = row["Location Fetched at"]?.trim().replace(/\s+/g, ' ');

    if (fetchedRaw) {
        // Format 1: DD/MM/YYYY HH:MM
        let match = fetchedRaw.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}:\d{2})$/);
        if (match) {
            const [_, dd, mm, yyyy, time] = match;
            fetchedDate = new Date(`${yyyy}-${mm}-${dd}T00:00:00Z`);
            fetchedTime = time;
        } else {
            // Format 2: YYYY-MM-DD HH:MM:SS
            match = fetchedRaw.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
            if (match) {
                const [_, yyyy, mm, dd, hh, min, ss] = match;
                fetchedDate = new Date(`${yyyy}-${mm}-${dd}T00:00:00Z`);
                fetchedTime = `${hh}:${min}`;
            } else {
                console.warn("Unrecognized date format:", fetchedRaw);
            }
        }
    }


    return {
        suspectNumber: row["Suspect No."]?.trim(),
        imei: String(row["IMEI"]).replace(/[^\d]/g, ''),
        provider: row["Provider"]?.trim(),
        fetchedDate,
        fetchedTime,
        state: row["Suspect State"]?.trim(),
        district: row["Suspect District"]?.trim(),
        address: row["Address"]?.trim(),
        location: {
            type: "Point",
            coordinates: [longitude, latitude]
        },
        victim: {
            ackNumber: victimLoc.ackNumber,
            name: victimName?.trim(),
            phone: victimPhone?.trim(),
            district: victimLoc.district,
            state: victimLoc.state
        },
        category: matchAmount?.[1]?.trim(),
        amount: parseInt(matchAmount?.[2]?.replace(/,/g, '') || '0', 10)
    };
}
