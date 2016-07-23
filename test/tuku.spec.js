import test from 'ava'
import tuku from 'tuku'
import model from 'model'
import typeSet from 'typeSet'
import { takeEvery } from 'redux-saga'
import { put } from 'redux-saga/effects'

test.afterEach(() => {
  typeSet.clear()
})

test('create a new app', t => {
  const app = tuku()

  t.is(typeof app.middleware, 'function')
  t.is(typeof app.model, 'function')
  t.is(typeof app.router, 'function')
  t.is(typeof app.start, 'function')
  t.is(typeof app.store, 'object')
})

test('effect', t => {
  const app = tuku()

  const counter = model({
    namespace: 'counter',
    state: 0,
  })

  const increment = counter.action('increment')
  const double = counter.action('double')

  counter.reducer(on => {
    on(increment, state => state + 1)

    on(double, state => state * 2)
  })

  counter.effect(function* () {
    yield* takeEvery(increment.getType(), function* () {
      yield put(double())
    })
  })

  app.model(counter)

  app.start()

  app.store.dispatch(increment())

  t.is(app.store.getState().counter, 2)
})
