/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    SignalApi,
} from '../../../../generated/typescript/dist/api'
import { waitForAnyKey } from './wait'

const Signal = new SignalApi() as any

main()

async function main() {
    let signal = 1
    let signals = "move_signal"

    while (true) {
        console.log('Ready to send move signal...')
        await waitForAnyKey()

        const response = await Signal.broadcastSignal({
            signalName: signal
        })
        
        .catch((e: Error) => {
            console.error(e.message);  process.exit(1) // Halt if something goes wrong 
        })

        signals = signals + 1

        console.log(`Broadcast signal:  ${JSON.stringify(response.body)}\n`)
    }
}

