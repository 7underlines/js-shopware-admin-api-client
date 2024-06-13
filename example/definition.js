import { createFromPasswordAndLogin } from '../src/index.js';

async function test() {
    let api = await createFromPasswordAndLogin('http://localhost', 'admin', 'shopware');

    console.log(api.EntityDefinition.getRequiredFields('product'));
}

test();