import { create } from '../src/index.js';

async function test() {
    let api = await create('http://localhost', 'admin', 'shopware');

    console.log(api.EntityDefinition.getRequiredFields('product'));
}

test();