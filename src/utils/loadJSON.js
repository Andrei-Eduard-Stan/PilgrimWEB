export async function loadJSON(url){
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Unable to load ${url}: ${response.status}`);
    }

    return response.json();
}