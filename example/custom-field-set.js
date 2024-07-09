import { createFromIntegration } from '../src/index.js';

async function test() {
    let api = await createFromIntegration('http://localhost', 'SWIAD0VBY1HTR2PSTM5OAUVHMQ', 'eXcxZUlDWW5IZG1GRk5iM1MwUnRjb2cwN0dBcjFOQ2lySlUwYXk');

    let repository = api.create('custom_field_set');
    let set = repository.create(api.defaultContext, 'custom_field_set');
    console.log(set)
    // await repository.save(set, api.defaultContext());
}

test();