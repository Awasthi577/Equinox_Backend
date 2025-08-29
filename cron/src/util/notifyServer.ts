export const notifyServerOfNewArticles = async (BACKEND_URL: string) => {
    const graphqlEndpoint = BACKEND_URL;
    const mutation = `
    mutation {
      notifyAddedNews
    }
    `
    try {
        const res = await fetch(graphqlEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: mutation })
        });

        const result = await res.json();
        console.log("notifyAddedNews response:", result);
    } catch (err) {
        console.error("Failed to notify server:", err);
    }
};