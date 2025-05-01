class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");

        this.engine.inventory = []; // 初始化物品栏
        this.engine.show("<p>你醒来发现自己在一个陌生的房间中。你不记得自己是如何来到这里的，但你知道你必须找到出路。</p>");
        this.engine.updateInventory(); // 初始化物品栏显示
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        this.key = key; // 保存当前场景 key，以便密码错误时重试
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body);

        if (locationData.Choices && locationData.Choices.length > 0) {
            for (let choice of locationData.Choices) {
                if (choice.RequiresItem && !this.engine.hasItem(choice.RequiresItem)) continue;
                if (choice.RequiresItemNotExist && this.engine.hasItem(choice.RequiresItemNotExist)) continue;
                if (choice.AddItem && this.engine.hasItem(choice.AddItem.name)) continue;

                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.");
        }
    }

    handleChoice(choice) {
        if (choice) {
            this.engine.show(`&gt; ${choice.Text}`);

            // 需求物品检查
            if (choice.RequiresItem && !this.engine.hasItem(choice.RequiresItem)) {
                this.engine.show(`<p><strong>提示:</strong> ${choice.LockedDescription || "你需要一个特定的物品才能执行此操作。"}</p>`);
                return;
            }

            // 添加物品
            if (choice.AddItem) {
                if (this.engine.addItem(choice.AddItem)) {
                    this.engine.show(`<p><strong>获得物品:</strong> ${choice.AddItem.name}</p>`);
                    if (choice.AfterPickDescription) {
                        this.engine.show(`<p>${choice.AfterPickDescription}</p>`);
                    }
                }
            }

            // 替换物品
            if (choice.ReplaceItem && choice.WithItem) {
                if (this.engine.hasItem(choice.ReplaceItem)) {
                    this.engine.removeItem(choice.ReplaceItem);
                    this.engine.addItem(choice.WithItem);
                    this.engine.show(`<p><strong>物品变化:</strong> ${choice.ReplaceItem} 变成了 ${choice.WithItem.name}</p>`);
                }
            }

            // 密码输入
            if (choice.NeedsPassword) {
                let userPassword = prompt(choice.PasswordPrompt || "请输入密码:");
                if (userPassword === choice.CorrectPassword) {
                    this.engine.show(`<p><strong>密码正确!</strong> 门开了。</p>`);
                    this.engine.gotoScene(Location, choice.Target);
                } else {
                    this.engine.show(`<p><strong>密码错误!</strong> 请再试一次。</p>`);
                    // 密码错误时，重新渲染当前场景，保留选项以便重试
                    this.engine.gotoScene(Location, this.key);
                }
                return;
            }

            // 其他场景跳转
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');
