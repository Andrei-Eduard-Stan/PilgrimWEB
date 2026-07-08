export function createDashboardShell(){

    const shell = document.createElement("div");
    const header = document.createElement("header");
    const identity = document.createElement("div");
    const route = document.createElement("p");
    const title = document.createElement("h1");
    const status = document.createElement("div");
    const body = document.createElement("div");
    const workspace = document.createElement("section");
    const sidebar = document.createElement("aside");

    shell.className = "dashboard-shell";
    header.className = "dashboard-header";
    identity.className = "dashboard-header__identity";
    status.className = "dashboard-header__status";
    body.className = "dashboard-body";
    workspace.className = "app-region app-region--workspace";
    sidebar.className = "app-region app-region--sidebar";

    route.textContent = "~/aes/technical-development/request";
    title.textContent = "Technical Development Support Request";

    workspace.setAttribute("aria-label", "workspace region");
    sidebar.setAttribute("aria-label", "sidebar region");

    identity.append(route,title);
    header.append(identity, status);
    body.append(workspace, sidebar);
    shell.append(header, body);

    return{

        element:shell,
        regions:{
            status,
            workspace,
            sidebar
        },
    };

}
