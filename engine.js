class Engine {

    static load(...args) {
        window.onload = () => new Engine(...args);
    }

    constructor(firstSceneClass, storyDataUrl) {
        this.firstSceneClass = firstSceneClass;
        this.storyDataUrl = storyDataUrl;
        
        // 初始化物品栏
        this.inventory = [];

        // 获取容器
        this.gameContainer = document.getElementById('game-container');
        if (!this.gameContainer) {
            this.gameContainer = document.body;
        }

        this.header = this.gameContainer.appendChild(document.createElement("h1"));
        this.output = this.gameContainer.appendChild(document.createElement("div"));
        this.output.id = "output";
        this.actionsContainer = this.gameContainer.appendChild(document.createElement("div"));

        // 初始化物品栏显示
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

    // 添加物品栏方法
    updateInventory() {
        if (!this.inventoryItems) return;
        
        // 清空当前物品栏
        this.inventoryItems.innerHTML = '';
        
        if(this.inventory.length === 0) {
            // 如果物品栏为空，显示提示
            let emptyText = document.createElement('p');
            emptyText.id = 'empty-inventory';
            emptyText.textContent = '物品栏为空';
            this.inventoryItems.appendChild(emptyText);
        } else {
            // 显示所有物品
            for(let item of this.inventory) {
                let itemDiv = document.createElement('div');
                itemDiv.className = 'inventory-item';
                itemDiv.innerHTML = `<strong>${item.name}</strong><p>${item.description}</p>`;
                this.inventoryItems.appendChild(itemDiv);
            }
        }
    }
    
    // 添加物品到物品栏
    addItem(item) {
        if(!this.hasItem(item.name)) {
            this.inventory.push(item);
            this.updateInventory();
            return true;
        }
        return false;
    }
    
    // 从物品栏移除物品
    removeItem(itemName) {
        this.inventory = this.inventory.filter(item => item.name !== itemName);
        this.updateInventory();
    }
    
    // 检查物品栏中是否有特定物品
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