class Engine {

    static load(...args) {
        window.onload = () => new Engine(...args);
    }

    constructor(firstSceneClass, storyDataUrl) {
        this.firstSceneClass = firstSceneClass;
        this.storyDataUrl = storyDataUrl;
        
        //Initialize inventory
        this.inventory = [];

        //Get containers
        this.gameContainer = document.getElementById('game-container');
        if (!this.gameContainer) {
            this.gameContainer = document.body;
        }

        this.header = this.gameContainer.appendChild(document.createElement("h1"));
        this.output = this.gameContainer.appendChild(document.createElement("div"));
        this.output.id = "output";
        this.actionsContainer = this.gameContainer.appendChild(document.createElement("div"));

        //Initialize inventory displayment
        this.inventoryItems = document.getElementById('inventory-items');

        fetch(storyDataUrl).then(
            (response) => response.json()
        ).then(
            (json) => {
                this.storyData = json;
                this.gotoScene(firstSceneClass)
            }
        );
    }

    gotoScene(sceneClass, data) {
        this.scene = new sceneClass(this);
        this.scene.create(data);
    }

    addChoice(action, data) {
        let button = this.actionsContainer.appendChild(document.createElement("button"));
        button.innerText = action;
        button.onclick = () => {
            while(this.actionsContainer.firstChild) {
                this.actionsContainer.removeChild(this.actionsContainer.firstChild)
            }
            this.scene.handleChoice(data);
        }
    }

    setTitle(title) {
        document.title = title;
        this.header.innerText = title;
    }

    show(msg) {
        let div = document.createElement("div");
        div.innerHTML = msg;
        this.output.appendChild(div);
    }

    //Update the inventory UI
    updateInventory() {
        if (!this.inventoryItems) return;
        
        //Clear current inventory items when empty
        this.inventoryItems.innerHTML = '';
        
        if(this.inventory.length === 0) {
            //pampt hint if inventory is empty
            let emptyText = document.createElement('p');
            emptyText.id = 'empty-inventory';
            emptyText.textContent = '物品栏为空';
            this.inventoryItems.appendChild(emptyText);
        } else {
            //Shows all item
            for(let item of this.inventory) {
                let itemDiv = document.createElement('div');
                itemDiv.className = 'inventory-item';
                itemDiv.innerHTML = `<strong>${item.name}</strong><p>${item.description}</p>`;
                this.inventoryItems.appendChild(itemDiv);
            }
        }
    }
    
    //add item when items picked up
    addItem(item) {
        if(!this.hasItem(item.name)) {
            this.inventory.push(item);
            this.updateInventory();
            return true;
        }
        return false;
    }
    
    //Remove item  
    removeItem(itemName) {
        this.inventory = this.inventory.filter(item => item.name !== itemName);
        this.updateInventory();
    }
    
    //Check if the inventory contains a specific item
    hasItem(itemName) {
        return this.inventory.some(item => item.name === itemName);
    }
}

class Scene {
    constructor(engine) {
        this.engine = engine;
    }

    create() { }

    update() { }

    handleChoice(action) {
        console.warn('no choice handler on scene ', this);
    }
}
