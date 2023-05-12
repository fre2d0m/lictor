const index = [];

function route(component) {
    const { page } = component;
    index.push({
        name: component.name,
        path: page.route,
        meta: {
            ...page
        },
        component,
        props: true
    });
}

const views = import.meta.glob('../views/*.vue');


const indexPromise = Promise.all(
    Object.keys(views).map(path =>
        views[path]().then(view => {
            const component = view.default;
            if (!component.page) {
                console.error(`Failed to load ${path} to route`, component);
            } else if (!component.page.route) {
                console.warn(`View ${component.name} will be ignored.`, component.name);
            } else {
                route(component);
            }
        })
    )
).then(() => {
    return index;
});

export default indexPromise;
