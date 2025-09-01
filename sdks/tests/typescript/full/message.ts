import { 
    MessageApi
} from '../../../generated/typescript'

async function main() {
    const messageApi = new MessageApi();
    console.log('Publishing message...');
   const res = await messageApi.publishMessage({
        name: 'something'
    })

    console.log('response:', JSON.stringify(res.body, null, 2))
}

main()