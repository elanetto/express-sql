document.addEventListener('DOMContentLoaded', async function () {
    const blog = document.getElementById('blog');

    try {
        const res = await fetch('http://localhost:3000/post', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch posts: ${res.status}`);
        }

        const data = await res.json();

        data.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('blog-post');

            postElement.innerHTML = `
                <h2 class="blog-title">${post.title}</h2>
                <img src="${post.image}" alt="${post.title}" class="blog-image" />
                <p class="blog-content">${post.content}</p>
                <div class="blog-bottom">
                    <button id="comment-this">Add comment</button>
                </div>
            `;

            blog.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
    }
});
