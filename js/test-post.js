document.querySelector('#test-form').addEventListener("submit", async (e) => {
    e.preventDefault();
    const content = document.querySelector('#test-content').value;

    const body = {
        content: content,
    };

    const res = await fetch('http://localhost:3000/test', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log(data);
});
