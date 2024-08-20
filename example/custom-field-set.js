import { create } from '../src/index.js';

async function test() {
    let api = await create('http://localhost', 'admin', 'shopware');

    let repository = api.create('custom_field_set');
    let set = repository.create();
    set.name = 'Example set';
    await repository.save(set, api.defaultContext());
}

test();