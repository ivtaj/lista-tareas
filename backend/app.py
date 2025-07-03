from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Mock database - lista en memoria
tasks = []
next_id = 1

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    priority_filter = request.args.get('priority')
    
    if priority_filter:
        filtered_tasks = [task for task in tasks if task['priority'] == priority_filter]
        return jsonify(filtered_tasks)
    
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def create_task():
    global next_id
    data = request.get_json()
    
    if not data or not data.get('title') or not data.get('title').strip():
        return jsonify({'error': 'El título es obligatorio'}), 400
    
    task = {
        'id': next_id,
        'title': data['title'],
        'priority': data['priority']
    }
    
    tasks.append(task)
    next_id += 1
    
    return jsonify(task), 201

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks
    tasks = [task for task in tasks if task['id'] != task_id]
    return jsonify({'message': 'Task deleted successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)