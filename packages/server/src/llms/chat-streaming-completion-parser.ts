import { EventEmitter } from 'events';

export default class extends EventEmitter {
    write(fragment: string) {
        const lines = fragment
            .toString()
            .split('\n')
            .filter(line => line.trim() !== '');
        for (const line of lines) {
            const message = line.replace(/^data: /, '');
            if (message === '[DONE]') {
                this.emit('done');
                return; // Stream finished
            }
            try {
                const parsed = JSON.parse(message);
                this.emit('message', parsed);
            } catch (error) {
                console.error('Could not JSON parse stream message', message, error);
            }
        }
    }
}
