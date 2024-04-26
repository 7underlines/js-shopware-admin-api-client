# Admin JavaScript-API Client for Shopware 6

This code highly bases on the [Administration Code](https://github.com/shopware/platform/tree/745f1f7aaa5c47d123e04b5b5b93b81161eae19a/src/Administration/Resources/app/administration/src/core/data-new) and made JavaScript compatible.

## Running the examples

Clone the repository and run the following commands from inside the repository:

```bash
docker-compose up -d
npm i
# Wait until the shop is available at http://localhost
node example/product-password.js
```

Once you are done, you can stop the docker container with:

```bash
docker-compose down
```

## Creation of API Client

### Using Username and Password

```js
import {createFromPasswordAndLogin} from 'shopware-admin-api';

let api = await createFromPasswordAndLogin('http://myshop.com', 'username', 'password', 1);
```

### Using Integration

```js
import {createFromIntegration} from 'shopware-admin-api';

let api = await createFromIntegration('http://myshop.com', 'client_id', 'client_secret', 1);
```


## Usage

```js
// Create repository
const productRepository = api.create('product');

// Access default context
const context = api.defaultContext();

// Acccess entity definition (contains the schema, required fields etc.)
const definition = api.EntityDefinition;

console.log(definition.get('product'))
console.log(definition.getRequiredFields('product'))
```

## Credits

- [Soner Sayakci](https://github.com/shyim) - Original Creator

## License

[MIT](LICENSE.md)