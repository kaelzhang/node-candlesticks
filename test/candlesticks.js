import test from 'ava'
import candlesticks from '../src'
import DataSource from 'data-source'
import QQLoader from 'data-source-loader-qq'


test('normal', t => {
  const source = new DataSource({
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'kael',
      password: '123456',
      database: 'compton'
    },
    code: CODE,
    loader: QQLoader
  })


  
})
