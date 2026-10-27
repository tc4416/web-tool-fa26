console.log("javescript linked");

window.onload = () => {
  // each project is a tab: a name plus its own list of entries
  let projects = [{ name: "project 1", entries: [""] }];
  let current = 0;

  let tabBar = document.getElementById("tabBar");
  let inputField = document.getElementById("inputField");
  let list = inputField.querySelector("ul");
  let submit = document.getElementById("submitButton");
  let clear = document.getElementById("clearButton");
  let output = document.getElementById("output");

  let url = "https://api.openai.com/v1/chat/completions";
  let apiKey = key;

  // bring back whatever was saved last time
  let saved = localStorage.getItem("projects");
  if (saved) projects = JSON.parse(saved);

  //LLM Request Function
  async function queryLanguageModel(userQuery) {
    output.textContent = "thinking...";

    let payload = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Fix grammar and flow only. Do not restructure sentences, " +
            "substitute word choices, or change the tone. Keep the author's " +
            "phrasing wherever it is already correct. Return the bullet list libe by line" +
            "and nothing else.",
        },
        {
          role: "user",
          content: userQuery,
        },
      ],
    };

    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify(payload),
    };

    let response = await fetch(url, options);
    let data = await response.json();

    if (data.error) {
      output.textContent = "Error: " + data.error.message;
      console.log(data);
      return;
    }

    let modelResponse = data.choices[0].message.content;
    console.log(modelResponse);
    output.textContent = modelResponse;
  }

  // read every textarea on screen back into the current project,
  // so nothing is lost when you switch tabs or hit submit
  function saveEntries() {
    let boxes = document.getElementsByClassName("entries");
    projects[current].entries = []; //array of entried of each project
    for (let i = 0; i < boxes.length; i++) {
      projects[current].entries.push(boxes[i].value);
    }
    localStorage.setItem("projects", JSON.stringify(projects));
  }

  // rebuild the entry list from the current project's array
  function renderEntries() {
    list.innerHTML = "";
    for (let i = 0; i < projects[current].entries.length; i++) {
      let li = document.createElement("li");
      let ta = document.createElement("textarea");
      ta.classList.add("entries");
      ta.value = projects[current].entries[i];
      ta.placeholder = "anything you'd like to dump";
      li.appendChild(ta);
      list.appendChild(li);
    }
  }

  function focusLast() {
    let boxes = document.getElementsByClassName("entries");
    if (boxes.length) boxes[boxes.length - 1].focus();
  }

  // rebuild the tab strip
  function renderTabs() {
    tabBar.innerHTML = "";

    projects.forEach((p, i) => {
      let tab = document.createElement("div");
      tab.classList.add("tab");
      if (i === current) tab.classList.add("active");
      tab.textContent = p.name;
      tab.title = "double-click to rename";

      // click to switch
      tab.addEventListener("click", () => {
        if (i === current) return;
        saveEntries();
        current = i;
        renderTabs();
        renderEntries();
        focusLast();
      });

      // double-click to rename, in place
      tab.addEventListener("dblclick", () => {
        tab.contentEditable = "true";
        tab.focus();
      });
      tab.addEventListener("blur", () => {
        tab.contentEditable = "false";
        p.name = tab.textContent.trim() || "untitled";
        tab.textContent = p.name;
        localStorage.setItem("projects", JSON.stringify(projects));
      });
      tab.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          tab.blur();
        }
      });

      tabBar.appendChild(tab);
    });

    // the + button
    let add = document.createElement("button");
    add.id = "addTab";
    add.textContent = "+";
    add.title = "new project";
    add.addEventListener("click", () => {
      saveEntries();
      projects.push({ name: "untitled", entries: [""] });
      current = projects.length - 1;
      renderTabs();
      renderEntries();
      focusLast();
    });
    tabBar.appendChild(add);
  }

  inputField.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" || e.shiftKey) return;
    if (!e.target.classList.contains("entries")) return;

    e.preventDefault();
    saveEntries();
    projects[current].entries.push("");
    renderEntries();
    focusLast();
  });

  submit.addEventListener("click", () => {
    saveEntries(); // picks up the last line, which was never Entered

    let bullets = "";
    let entries = projects[current].entries;
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].trim()) bullets += "- " + entries[i].trim() + "\n";
    }

    if (!bullets) return;
    output.innerText = bullets;
    queryLanguageModel(bullets);
  });
  clear.addEventListener("click", () => {
    if (!confirm("Clear all entries in this project?")) return;

    projects[current].entries = [""];
    localStorage.setItem("projects", JSON.stringify(projects));
    renderEntries();
    output.textContent = "";
    focusLast();
  });

  renderTabs();
  renderEntries();
  focusLast();
};
