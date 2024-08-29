import { create } from '../src/index.js';
import Criteria from '../src/data/criteria.data.js';

// this is a test to see if the token refresh works
async function test() {
    let api = await create('http://localhost', 'admin', 'shopware');

    let repository = api.create('product');
    let criteria = new Criteria();
    criteria.limit = 1;
    criteria.addFilter(Criteria.equals('parentId', null));

    const startTime = Date.now()
    let lastToken = api.defaultContext().authToken.access
    while (true) {
        if (lastToken !== api.defaultContext().authToken.access) {
            console.log('Token refreshed')
            lastToken = api.defaultContext().authToken.access
        }
        console.log(api.defaultContext().authToken.access)
        const currentTime = Date.now()
        const elapsedTime = (currentTime - startTime) / 1000
        console.log(elapsedTime)
        let products = await repository.search(criteria, api.defaultContext());
        for (const product of products) {
            console.log(product.name);
        }
        await new Promise(r => setTimeout(r, 8000));
    }
}

test();