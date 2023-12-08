import type { Emitter } from '../index.js';
import { e as createEvents } from '../index.js'

interface Events {
  add: (c: number) => void
  set: (a: string) => void
  tick: () => void
}

function fn(a: string): void {
  console.log(a)
}

let ee = createEvents<Events>()
ee.on('set', a => {
  fn(a)
})

ee.emit('add', 2)
ee.emit('tick')

ee.e = {
  set: [
    a => {
      fn(a)
    }
  ]
}

function listenersCount(emitter: Emitter): number {
  let count = 0
  for (let i in emitter.e) {
    count += emitter.e[i]?.length ?? 0
  }
  return count
}

console.log(listenersCount(ee))
