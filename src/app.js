
const App = {
  contracts: {},


  // this is a main function that loads all the function by order...
////////////////////////////////////////////////////////////////////////////
  load: async () => {
      console.log("App is loading...");
      await App.loadWeb3();
      await App.loadAccount();
      await App.loadContract();
      await App.renderTasks(); // ✅ Load tasks immediately
  },





  // this function try to connect our crypto wallet to the browser whith the web3 library
////////////////////////////////////////////////////////////////////////////
  loadWeb3: async () => {
      if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          App.web3Provider = window.ethereum;
          try {
              await window.ethereum.request({ method: "eth_requestAccounts" });
              console.log("MetaMask connected!");
          } catch (error) {
              console.error("User denied MetaMask connection:", error);
              window.alert("You denied access to MetaMask.");
          }
      } else {
          console.log("MetaMask not detected. Install MetaMask to use this dApp.");
          window.alert("Please install MetaMask.");
      }
  },




// this function loads the current wallets address 
////////////////////////////////////////////////////////////////////////////
  loadAccount: async () => {
      const accounts = await window.web3.eth.getAccounts();
      App.account = accounts[0];
      console.log("Connected Account:", App.account);
      $("#account").html(App.account);
  },





//this function fetchs the binary compiled file in order to use the smartcontracts
////////////////////////////////////////////////////////////////////////////
  loadContract: async () => {
      try {
          const todoList = await $.getJSON("../build/contracts/TodoList.json"); 
          const TruffleContract = window.TruffleContract; 
          App.contracts.TodoList = TruffleContract(todoList);
          App.contracts.TodoList.setProvider(App.web3Provider);
          App.todoList = await App.contracts.TodoList.deployed();
          console.log("Contract Loaded:", App.todoList);
      } catch (error) {
          console.error(" Error loading contract:", error);
          alert("Failed to load contract. Check console for details.");
      }
  },












// this function used to to create a new task and add to the pending if completed then it will be set to the completed 
////////////////////////////////////////////////////////////////////////////
  createTask: async (event) => {
      event.preventDefault();

      const content = document.getElementById("newTask").value;
    
      if (!content) {
          alert("Task cannot be empty!");
          return;
      }

      try {
          await App.todoList.createTask(content, { from: App.account });
          console.log("✅ Task Created:", content);
          window.location.reload();
          document.getElementById("newTask").value='';
      } catch (error) {
          console.error(" Error creating task:", error);
          alert("Failed to create task. See console for details.");
      }
  },



//this function  renders the page and input forms 
////////////////////////////////////////////////////////////////////////////
renderTasks: async () => {
  const taskCount = await App.todoList.taskCount();
    console.log(`Task Count: ${taskCount.toNumber()}`);

    $("#taskList").html(""); // Clear pending tasks
    $("#completedTaskList").html(""); // Clear completed tasks

    for (let i = 1; i <= taskCount; i++) {
        const task = await App.todoList.tasks(i);
        const taskId = task[0].toNumber();
        const taskContent = task[1];
        const taskCompleted = task[2];

        //  Create task item with checkbox
        const taskElement = $(`
            <li class="mb-2" id="task-${taskId}">
                <input type="checkbox" ${taskCompleted ? "checked" : ""} />
                <span>${taskContent}</span>
            </li>
        `);

        //  If completed, append to completed section
        if (taskCompleted) {
            $("#completedTaskList").append(taskElement);
        } else {
            $("#taskList").append(taskElement);

            //  On checkbox change, move task to completed
            taskElement.find("input").on("change", function () {
                App.moveTaskToCompleted(taskId);
            });
        }
    }
},





//this function chages the status of task by calling the toggleCompleted smart contract.
////////////////////////////////////////////////////////////////////////////
moveTaskToCompleted: async (taskId) => {
  console.log(` Marking Task ${taskId} as completed...`);

  
  await App.todoList.toggleCompleted(taskId,{ from: App.account })
   window.location.reload();
  const taskItem = $(`#task-${taskId}`);
  console.log(taskItem);
    taskItem.find("input").prop("checked", true); //  Check the checkbox
    $("#completedTaskList").append(taskItem); //  Move to completed section
    taskItem.remove(); //  Remove from pending tasks list

    console.log(` Task ${taskId} moved to completed section.`);
},


};


// from here execution starts...
////////////////////////////////////////////////////////////////////////////

//  Start app when the page loads
$(document).ready(() => {
  App.load();
});
