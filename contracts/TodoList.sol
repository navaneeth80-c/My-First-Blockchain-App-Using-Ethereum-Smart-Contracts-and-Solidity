pragma solidity >=0.4.22 <0.6.0;

contract TodoList {
    uint public taskCount = 0;

    struct Task {
        uint id;
        string content;
        bool completed;
    }
        //this is an varible that can hold objects of Task type and we are creating a map datatyped objects of it  .
    mapping(uint => Task) public tasks; //creating hash map variable named tasks of key unint value of the key is Task.


    event TaskCreated(
        uint id,
        string content,
        bool completed
    );
    event TaskCompleted(uint id,string content,bool completed);





    constructor() public {
        createTask("sleep");
        createTask("sleep walk");
    }


    function createTask( string memory _content) public {
        taskCount++;
        tasks[taskCount] =  Task(taskCount,_content,false); // here we are crating a object of the struct Task and appending it to the hash map tasks with key value as id and object of Task
        emit TaskCreated(taskCount, _content, false);
   
    }

    function toggleCompleted (uint _id) public {
        // Task memory _task = tasks[_id];
        // _task.completed = !_task.completed;
        // tasks[_id] = _task;
        tasks[_id].completed = ! tasks[_id].completed;
        emit TaskCompleted(_id, tasks[_id].content,tasks[_id].completed);
    }
}
