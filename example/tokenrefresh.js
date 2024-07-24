import { createFromPasswordAndLogin } from '../src/index.js';
import Criteria from '../src/data/criteria.data.js';

async function test() {
    let api = await createFromPasswordAndLogin('http://localhost', 'admin', 'shopware');

    let repository = api.create('product');
    let criteria = new Criteria();
    criteria.limit = 1;
    criteria.addFilter(Criteria.equals('parentId', null));

    const startTime = Date.now()
    while (true) {
        await new Promise(r => setTimeout(r, 10000));
        console.log(api.defaultContext().authToken.access)
        const currentTime = Date.now()
        const elapsedTime = (currentTime - startTime) / 1000
        console.log(elapsedTime)
        let products = await repository.search(criteria, api.defaultContext());
        for (const product of products) {
            console.log(product.name);
        }
    }
}

test();