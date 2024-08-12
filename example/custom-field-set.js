import { createFromPasswordAndLogin } from '../src/index.js';

async function test() {
    let api = await createFromPasswordAndLogin('http://localhost', 'admin', 'shopware');

    let repository = api.create('custom_field_set');
    let set = repository.create(api.defaultContext, '43a23e0c03bf4ceabc6055a2185faa87');
    set.name = 'Example set';
    await repository.save(set, api.defaultContext());
}

test();