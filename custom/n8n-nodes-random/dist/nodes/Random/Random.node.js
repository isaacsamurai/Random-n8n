"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Random = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class Random {
    description = {
        displayName: 'Random',
        name: 'random',
        icon: 'file:Random.svg',
        group: ['transform'],
        version: 1,
        description: 'True Random Number Generator using Random.org',
        defaults: { name: 'Random' },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        name: 'True Random Number Generator',
                        value: 'generate',
                        description: 'Generates a true random number using Random.org',
                    },
                ],
                default: 'generate',
                description: 'Select the operation to perform',
            },
            {
                displayName: 'Min',
                name: 'min',
                type: 'number',
                default: 1,
                required: true,
                description: 'Minimum integer value',
            },
            {
                displayName: 'Max',
                name: 'max',
                type: 'number',
                default: 100,
                required: true,
                description: 'Maximum integer value',
            },
        ],
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const MIN_LIMIT = -1000000000;
        const MAX_LIMIT = 1000000000;
        const validateMinMax = (min, max) => {
            if (!Number.isInteger(min) || !Number.isInteger(max)) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Por favor, insira apenas números inteiros para Min e Max.');
            }
            if (min > max) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'O valor mínimo não pode ser maior que o máximo.');
            }
            if (min < MIN_LIMIT || max > MAX_LIMIT) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `O valor mínimo deve ser até ${MIN_LIMIT} e o máximo até ${MAX_LIMIT}.`);
            }
        };
        for (let i = 0; i < Math.max(1, items.length); i++) {
            try {
                const min = this.getNodeParameter('min', i, 1);
                const max = this.getNodeParameter('max', i, 100);
                validateMinMax(min, max);
                let value;
                if (min === max) {
                    value = min;
                }
                else {
                    const url = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;
                    const response = await this.helpers.httpRequest({ url, method: 'GET', encoding: 'text' });
                    value = parseInt(response.trim(), 10);
                    if (Number.isNaN(value)) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Houve um problema ao buscar o número aleatório. Tente novamente.');
                    }
                }
                returnData.push({
                    json: {
                        result: value,
                    },
                });
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: `Ocorreu um problema ao gerar o número aleatório: ${error?.message ?? String(error)}`
                        }
                    });
                }
                else {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Ocorreu um problema ao gerar o número aleatório: ${error?.message ?? String(error)}`);
                }
            }
        }
        return [returnData];
    }
}
exports.Random = Random;
