const WebSocket = require('ws');
const { Types: { ObjectId } } = require('mongoose');

const { taskServices } = require("./api/service/tasks")
const { taskAggregate } = taskServices;

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// WebSocket event handlers
wss.on('connection', ws => {
    console.log('Client connected');

    // Handle incoming messages from the client
    ws.on('message', async message => {
        // Parse incoming message from JSON format
        const data = JSON.parse(message);
        switch (data.action) {
            case 'getTasks':
                // Extract parameters from the incoming message
                const userId = data.userId;
                const page = data.page || 1;
                const pageSize = data.pageSize || 10;

                try {
                    // Aggregate pipeline to fetch tasks for a specific user and apply pagination
                    const pipeline = [
                        { $match: { userId: new ObjectId(userId) } },
                        { $sort: { dueDate: -1 } },
                        { $skip: (page - 1) * pageSize },
                        { $limit: pageSize }
                    ];

                    // Execute the aggregation pipeline to fetch tasks
                    const tasks = await taskAggregate(pipeline);

                    // Log fetched tasks to the console
                    console.log("tasks: ", tasks)

                    // Send paginated tasks to the client
                    ws.send(JSON.stringify({ action: 'tasks', tasks }));
                } catch (error) {
                    // Handle errors during task fetching
                    console.error('Error fetching tasks:', error);
                    ws.send(JSON.stringify({ action: 'error', message: 'An error occurred while fetching tasks' }));
                }
                break;
            default:
                // Log unknown actions received from the client
                console.log('Unknown action:', data.action);
        }
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
