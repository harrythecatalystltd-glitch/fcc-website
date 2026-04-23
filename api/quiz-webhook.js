const GHL_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/7SAACxzSKnpblPNlayky/webhook-trigger/96766bc8-e57a-4558-bb78-04026ba51742';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const response = await fetch(GHL_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        return res.status(200).json({ ok: true, status: response.status });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
