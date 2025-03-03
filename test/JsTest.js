/* const App = {
  contracts: {},

  load: async () => {
    console.log("App is loading...");
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
  },

  loadWeb3: async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      App.web3Provider = window.ethereum; // ✅ Fixed MetaMask Deprecation Warning
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log("✅ MetaMask connected!");
      } catch (error) {
        console.error("❌ User denied MetaMask connection:", error);
        window.alert("You denied access to MetaMask.");
      }
    } else {
      console.log(
        "❌ MetaMask not detected. Install MetaMask to use this dApp."
      );
      window.alert("Please install MetaMask.");
    }
  },

  loadAccount: async () => {
    const accounts = await window.web3.eth.getAccounts();
    App.account = accounts[0];
    console.log("Connected Account:", App.account);
    document.getElementById("account").innerText = App.account; // ✅ Display account in navbar
    $("#account").html(App.account);
  },

  loadContract: async () => {
    try {
      const todoList = await $.getJSON("../build/contracts/TodoList.json"); // ✅ Ensures correct path
      const TruffleContract = window.TruffleContract; // ✅ Load Truffle Contract
      App.contracts.TodoList = TruffleContract(todoList);
      App.contracts.TodoList.setProvider(App.web3Provider);
      App.todoList = await App.contracts.TodoList.deployed();
      console.log("✅ Contract Loaded:", App.todoList);
    } catch (error) {
      console.error("❌ Error loading contract:", error);
      alert("Failed to load contract. Check console for details.");
    }
  },

  createTask: async (event) => {
    event.preventDefault(); // ✅ Prevents page reload

    const content = document.getElementById("newTask").value;
    if (!content) {
      alert("Task cannot be empty!");
      return;
    }

    try {
      await App.todoList.createTask(content, { from: App.account });
      console.log("✅ Task Created:", content);
      window.location.reload(); // ✅ Refresh page after task creation
    } catch (error) {
      console.error("❌ Error creating task:", error);
      alert("Failed to create task. See console for details.");
    }
  },

  render: async () => {
    console.log(App.account);
    //await $("#account").html(App.account);
    if (App.loading) {
      return; // to prevent doubble renduring
    }

    App.setLoading(true);

    await App.renderTasks();
    App.setLoading(false);
  },

  renderTasks: async () => {
    //loading the task from the block chain
    const taskCount = await App.todoList.taskCount();
    const $taskTemplate = $(".taskTemplate");

    for (let i = 1; i <= taskCount; i++) {
      const task = await App.todoList.tasks(i);
      const taskId = task[0].toNumber();
      const taskContent = task[1];
      const taskCompleted = task[2];
    
    const $newTaskTemplate = $taskTemplate.clone();
    $newTaskTemplate.find(".content").html(taskContent);
    $newTaskTemplate
      .find("input")
      .prop("name", taskId)
      .prop("checked", taskCompleted);
    //  .on("click", App.toggleCompleted);

    //render out each task with a new task templete
    if (taskCompleted) {
      $("#completedTaskList").append($newTaskTemplate);
    }

    //show the task
    $newTaskTemplate.show();
   
  }
  $taskTemplate.show();
  },

  setLoading: (boolean) => {
    App.loading = boolean;
    const loader = $("#loader");
    const content = $("#content");
    if (boolean) {
      loader.show();
      content.hide();
    }
  },
};

// ✅ Start app when the page loads
$(document).ready(() => {
  App.load();
});

const App = {
  contracts: {},

  load: async () => {
      console.log("App is loading...");
      await App.loadWeb3();
      await App.loadAccount();
      await App.loadContract();
      await App.render();
  },

  loadWeb3: async () => {
      if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          App.web3Provider = window.ethereum; 
          try {
              await window.ethereum.request({ method: "eth_requestAccounts" });
              console.log("✅ MetaMask connected!");
          } catch (error) {
              console.error("❌ User denied MetaMask connection:", error);
              window.alert("You denied access to MetaMask.");
          }
      } else {
          console.log("❌ MetaMask not detected. Install MetaMask to use this dApp.");
          window.alert("Please install MetaMask.");
      }
      console.log("came to loadweb3");
  },

  loadAccount: async () => {
      const accounts = await window.web3.eth.getAccounts();
      App.account = accounts[0];
      console.log("Connected Account:", App.account);
      $("#account").html(App.account);
      console.log("came to loaAccount");
  },

  loadContract: async () => {
      try {
          const todoList = await $.getJSON("../build/contracts/TodoList.json"); 
          const TruffleContract = window.TruffleContract; 
          App.contracts.TodoList = TruffleContract(todoList);
          App.contracts.TodoList.setProvider(App.web3Provider);
          App.todoList = await App.contracts.TodoList.deployed();
          console.log("✅ Contract Loaded:", App.todoList);
      } catch (error) {
          console.error("❌ Error loading contract:", error);
          alert("Failed to load contract. Check console for details.");
      }
      console.log("came to load contract");
  },

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
      } catch (error) {
          console.error("❌ Error creating task:", error);
          alert("Failed to create task. See console for details.");
      }
      console.log("came to create task");
  },

  render: async () => {
      if (App.loading) {
          return; 
      }
      App.setLoading(true);
      await App.renderTasks();
      App.setLoading(false);
  },

  renderTasks: async () => {
      const taskCount = await App.todoList.taskCount();
      const $taskTemplate = $(".taskTemplate");

      for (let i = 1; i <= taskCount; i++) {
          const task = await App.todoList.tasks(i);
          const taskId = task[0].toNumber();
          const taskContent = task[1];
          const taskCompleted = task[2];

          const $newTaskTemplate = $taskTemplate.clone();
          $newTaskTemplate.find(".content").html(taskContent);
          $newTaskTemplate
              .find("input")
              .prop("name", taskId)
              .prop("checked", taskCompleted);

          if (taskCompleted) {
              $("#completedTaskList").append($newTaskTemplate);
          } else {
              $("#taskList").append($newTaskTemplate);
          }

          $newTaskTemplate.show();
      }
  },

  setLoading: (boolean) => {
      App.loading = boolean;
      const loader = $("#loader");
      const content = $("#content");
      if (boolean) {
          loader.show();
          content.hide();
      } else {
          loader.hide();
          content.show();
      }
  },
};

// ✅ Start app when the page loads
$(document).ready(() => {
  App.load();
});
*/

  // renderTasks: async () => {
  //     const taskCount = await App.todoList.taskCount();
  //     console.log(`📌 Task Count: ${taskCount.toNumber()}`);

  //     for (let i = 1; i <= taskCount; i++) {
  //         const task = await App.todoList.tasks(i);
  //         const taskId = task[0].toNumber();
  //         const taskContent = task[1];
  //         const taskCompleted = task[2];

  //         // ✅ Create task item
  //         const taskElement = `<li>
  //             <input type="checkbox" ${taskCompleted ? "checked" : ""} disabled />
  //             <span>${taskContent}</span>
  //         </li>`;

  //         // ✅ Append to correct list
  //         if (taskCompleted) {
  //             $("#completedTaskList").append(taskElement);
  //         } else {
  //             $("#taskList").append(taskElement);
  //         }
  //     }
  // },
//   renderTasks: async () => {
//     const taskCount = await App.todoList.taskCount();
//     console.log(`📌 Task Count: ${taskCount.toNumber()}`);

//     $("#taskList").html(""); // Clear previous tasks
//     $("#completedTaskList").html(""); // Clear previous completed tasks

//     for (let i = 1; i <= taskCount; i++) {
//         const task = await App.todoList.tasks(i);
//         const taskId = task[0].toNumber();
//         const taskContent = task[1];
//         const taskCompleted = task[2];

//         // ✅ Create task item with clickable checkbox
//         const taskElement = `
//             <li class="mb-2">
//                 <input type="checkbox" ${taskCompleted ? "checked" : ""} 
//                        onclick="App.toggleCompleted(${taskId})" />
//                 <span>${taskContent}</span>
//             </li>`;

//         if (taskCompleted) {
//             $("#completedTaskList").append(taskElement);
//         } else {
//             $("#taskList").append(taskElement);
//         }
//     }
// },

////////////////////////////////
//import TruffleContract from '@truffle/contract';
//const TruffleContract = require('@truffle/contract');

App = {
    contracts: {},
  
    //main function
    load: async () => {
      console.log("app is loading...");
      await App.loadWeb3();
      await App.loadAccount();
      await App.loadContract();
      await App.render();
    },
  
    //loading the web3 to make contact whith metamask
    loadWeb3: async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        App.web3Provider = window.web3.currentProvider;
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          console.log("MetaMask connected!");
        } catch (error) {
          console.error("User denied MetaMask connection:", error);
          window.alert("You denied access to MetaMask.");
        }
      }
      // Legacy dapp browsers (Older versions of MetaMask)
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
  
        console.log("Using legacy web3 provider.");
      }
      // Non-dapp browsers
      else {
        console.log("Non-Ethereum browser detected. Install MetaMask!");
        window.alert("MetaMask is required to use this dApp.");
      }
    },
  
    //this will get the account details of the account in the ether network.
    loadAccount: async () => {
      const accounts = await web3.eth.getAccounts();
      App.account = accounts[0];
      console.log("Connected Account:", App.account);
    },
  
    //this will get you ythe each acounts spacefic details after the deploy
    loadContract: async () => {
      const todoList = await $.getJSON("TodoList.json");
  
      App.contracts.TodoList = TruffleContract(todoList);
      //This sets up the connection between Truffle Contract and the Ethereum blockchain using Web3.
      App.contracts.TodoList.setProvider(App.web3Provider);
      App.todoList = await App.contracts.TodoList.deployed();
      console.log(App.todoList);
    },
    //show and hide the  contents
    /*
    setLoading: (boolean) => {
      App.loading = boolean;
      const loader = $("#loader");
      const content = $("#content");
      if (boolean) {
        loader.show();
        content.hide();
      } else {
        loader.hide();
        content.show();
      }
    },
    */
  
    // we will render to the front end
    render: async () => {
      $("#account").html(App.account);
    },
  };
  
  //here execution starts
  $(document).ready(() => {
    App.load();
  });
  