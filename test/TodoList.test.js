//const contract = require("@truffle/contract")
//const { assert } = require("chai");
/*
const { before } = require("mocha"); 
const { assert } = require("chai")

const TodoList = artifacts.require("./TodoList.sol")

contract("TodoList",(accounts)=>{
    before(async ()=>{
        this.TodoList = await TodoList.deployed()
    })
    it('deployed done', async ()=>{
        const address = await this.TodoList.address

        assert.notEqual(address, 0x0)
        assert.notEqual(address,'')
        assert.notEqual(address,null)
        assert.notEqual(address,undefined)
    })
})
    */
const { assert } = require("chai");
//const { before } = require("mocha");  // ✅ Import Mocha's `before`
const TodoList = artifacts.require("TodoList");

contract("TodoList", (accounts) => {
  let todoList;

  before(async () => {
    // ✅ Now `before()` is recognized
    todoList = await TodoList.deployed();
  });

  it("deploys successfully", async () => {
    const address = todoList.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
    console.log("✅ Contract deployed at:", address);
  });

  it("list task", async () => {
    const taskCount = await todoList.taskCount();
    const task = await todoList.tasks(taskCount);
    assert.equal(task.id.toNumber(), taskCount.toNumber());
    assert.equal(task.content, "sleep walk");
    assert.equal(task.completed, false);
    assert.equal(taskCount.toNumber(), 2);
  });

  it("create task", async () => {
    const result = await todoList.createTask("A new Task is Created..");
    const taskCount = await todoList.taskCount();
    assert.equal(taskCount, 3);
    console.log(result);
    const event = result.logs[0].args;
    console.log(event.content);
    assert.equal(event.content,'A new Task is Created..')
  });

  it("toggle function checked!!", async()=>{
    const result = await todoList.toggleCompleted(1);
    console.log("here we meet once again")
    console.log(result.logs[0]);
    assert.equal(result.logs[0].args.content,'sleep');
    assert.equal(result.logs[0].args.completed,true);
  })
});
