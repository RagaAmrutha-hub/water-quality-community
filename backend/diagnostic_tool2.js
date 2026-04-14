(async () => {
    try {
        const baseURL = 'https://water-quality-backend-81er.onrender.com';
        
        console.log("1. Contacting Server to Register...");
        const regRes = await fetch(`${baseURL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                reg_number: `DIAG_${Date.now()}`,
                name: "Diag User",
                password: "password123"
            })
        });
        const regData = await regRes.json();
        if (!regRes.ok) throw new Error("Register failed: " + JSON.stringify(regData));
        const token = regData.token;
        console.log(`Token received: ${token.substring(0, 20)}...`);

        console.log("2. Testing Water Insertion...");
        const waterRes = await fetch(`${baseURL}/api/water`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                color: "clear",
                temperature: 20,
                taste: "normal",
                ph: "7",
                turbidity: "1"
            })
        });
        const waterData = await waterRes.json();
        if (!waterRes.ok) console.error("Water Insertion ERROR:", waterData);
        else console.log("Water Results:", waterData);

        console.log("3. Testing Dashboard Stats Fetching...");
        const statsRes = await fetch(`${baseURL}/api/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const statsData = await statsRes.json();
        if (!statsRes.ok) console.error("Stats fetching ERROR:", statsData);
        else console.log("Stats Results:", statsData);

        console.log("4. Testing Complaint Fetching...");
        const compRes = await fetch(`${baseURL}/api/complaints/mine`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const compData = await compRes.json();
        if (!compRes.ok) console.error("Complaints fetching ERROR:", compData);
        else console.log("Complaints Results:", compData);

    } catch (err) {
        console.error("\n\n!!! SCRIPT ERROR !!!\n", err.message);
    }
})();
