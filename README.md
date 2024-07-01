<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Medical Camp Server README</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            width: 80%;
            margin: auto;
            overflow: hidden;
        }
        header {
            background: #f4f4f4;
            padding: 20px 0;
            text-align: center;
        }
        h1, h2, h3 {
            color: #444;
        }
        pre {
            background: #f4f4f4;
            padding: 10px;
            border: 1px solid #ddd;
            overflow: auto;
        }
        code {
            background: #f4f4f4;
            padding: 2px 4px;
            border: 1px solid #ddd;
            display: inline-block;
        }
    </style>
</head>
<body>
    <header>
        <h1>Medical Camp Server</h1>
    </header>
    <div class="container">
        <section>
            <p>Welcome to the server-side repository of the Medical Camp website! This project aims to provide a robust backend for organizing and managing medical camps, facilitating healthcare services, and promoting community health awareness.</p>
        </section>

        <section>
            <h2>Project Overview</h2>
            <p>Medical Camp is a comprehensive platform designed to streamline the organization and management of medical camps. It addresses several challenges in the healthcare sector by providing tools for efficient camp scheduling, participant and organizer registration, and disseminating healthcare information. This platform aims to enhance community health awareness and make healthcare services more accessible.</p>
        </section>

        <section>
            <h2>Features</h2>
            <ul>
                <li><strong>Camp Management:</strong> Schedule and manage medical camps efficiently.</li>
                <li><strong>Participant Registration:</strong> Easy registration process for attendees and volunteers.</li>
                <li><strong>Organizer Registration:</strong> Easy registration process for organizers.</li>
                <li><strong>Healthcare Services:</strong> Information on medical services provided at each camp.</li>
                <li><strong>Feedback and Testimonials:</strong> Insights and feedback from participants and organizers.</li>
                <li><strong>Resource Center:</strong> Educational materials and resources for health awareness.</li>
            </ul>
        </section>

        <section>
            <h2>Technologies Used</h2>
            <ul>
                <li><strong>Backend:</strong> Node.js, Express.js</li>
                <li><strong>Database:</strong> MongoDB</li>
                <li><strong>Authentication:</strong> JSON Web Tokens (JWT)</li>
                <li><strong>Payment Integration:</strong> Stripe API</li>
                <li><strong>Deployment:</strong> Firebase</li>
            </ul>
        </section>

        <section>
            <h2>Getting Started</h2>

            <h3>Installation</h3>
            <ol>
                <li>Clone the repository:
                    <pre><code>git clone https://github.com/your-username/medical-camp-server.git
cd medical-camp-server</code></pre>
                </li>
                <li>Install dependencies:
                    <pre><code>npm install</code></pre>
                </li>
            </ol>

            <h3>Setting Up</h3>
            <p>Set up environment variables:</p>
            <ol>
                <li>Create a <code>.env</code> file in the root directory.</li>
                <li>Add necessary variables (e.g., MongoDB URI, JWT secret, Stripe API keys).</li>
            </ol>

            <h3>Running Locally</h3>
            <p>Start the development server:</p>
            <pre><code>npm start</code></pre>
            <p>Open your web browser and navigate to <code>http://localhost:5000</code> (or the port specified in your configuration).</p>
        </section>

        <section>
            <h2>API Documentation</h2>
            <p>For detailed API documentation, refer to the <a href="API_DOCUMENTATION.md">API Documentation</a> file.</p>
        </section>

        <section>
            <h2>Contributing</h2>
            <p>We welcome contributions to enhance the functionality and user experience of the Medical Camp server. If you have any ideas, improvements, or bug fixes, feel free to fork the repository, create a new branch, and submit a pull request.</p>
        </section>

        <section>
            <h2>License</h2>
            <p>This project is licensed under the MIT License. See the <a href="LICENSE">LICENSE</a> file for more details.</p>
        </section>
    </div>
</body>
</html>
