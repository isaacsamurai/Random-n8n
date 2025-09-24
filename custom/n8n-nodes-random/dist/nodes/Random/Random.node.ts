import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

export class Random implements INodeType {
  description: INodeTypeDescription = {
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

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const MIN_LIMIT = -1000000000;
    const MAX_LIMIT = 1000000000;
    
    const validateMinMax = (min: number, max: number) => {
      if (!Number.isInteger(min) || !Number.isInteger(max)) {
        throw new NodeOperationError(this.getNode(), 'Por favor, insira apenas números inteiros para Min e Max.');
      }
      if (min > max) {
        throw new NodeOperationError(this.getNode(), 'O valor mínimo não pode ser maior que o máximo.');
      }
      if (min < MIN_LIMIT || max > MAX_LIMIT) {
        throw new NodeOperationError(this.getNode(),`O valor mínimo deve ser até ${MIN_LIMIT} e o máximo até ${MAX_LIMIT}.`
        );
      }
    };

    for (let i = 0; i < Math.max(1, items.length); i++) {
      try {
        const min = this.getNodeParameter('min', i, 1) as number;
        const max = this.getNodeParameter('max', i, 100) as number;

        validateMinMax(min, max);

        let value: number;

        if (min === max) {
          value = min;
        } else {
          const url = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;
          const response = await this.helpers.httpRequest({ url, method: 'GET', encoding: 'text' });
          value = parseInt((response as string).trim(), 10);

          if (Number.isNaN(value)) {
            throw new NodeOperationError(this.getNode(), 'Houve um problema ao buscar o número aleatório. Tente novamente.');
          }
        }

        returnData.push({
          json: {
            result: value,
          },
        });
      } catch (error: any) {
        
        if (this.continueOnFail()) {
          returnData.push({ 
            json: { 
              error: `Ocorreu um problema ao gerar o número aleatório: ${error?.message ?? String(error)}` 
            } 
          });
        } else {
          throw new NodeOperationError(this.getNode(), `Ocorreu um problema ao gerar o número aleatório: ${error?.message ?? String(error)}`);
        }
      }
    }

    return [returnData];
  }
}
