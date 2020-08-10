import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, ActivityIndicator, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import axios from 'axios'

const Main = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [numerators, setNumerators] = useState([])
  const [denominators, setDenominators] = useState([])
  const [range, setRange] = useState({
    num: [],
    den: [],
  })
  const [inputData, setInputData] = useState({
    '1a': '',
    '1b': '',
    '2a': '',
    '2b': '',
    '3': '',
  })

  const handleInputData = (key, value) => {
    setError(null)
  
    switch(key){
      case '1a':
        if (value !== '') {
          const numPair = numerators.find((item) => item.key === value)
          if (numPair) {
            setInputData({
              ...inputData,
              '1a': value,
              '1b': numPair.value
            })
          } else {
            setError(`Invalid number. Numerator should be between ${range.num[0]} and ${range.num[1]}`)
            setInputData({
              ...inputData,
              '1a': value,
            })
          }
        } else {
          setInputData({
            ...inputData,
            '1a': '',
            '1b': ''
          })
        }
        break
      case '2a':
        if (value !== '') {
          const denPair = denominators.find((item) => item.key === value)
          if (denPair) {
            setInputData({
              ...inputData,
              '2a': value,
              '2b': denPair.value
            })
          } else {
            setError(`Invalid number. Denominator should be between ${range.den[0]} and ${range.den[1]}`)
            setInputData({
              ...inputData,
              '2a': value,
            })
          }
        } else {
          setInputData({
            ...inputData,
            '2a': '',
            '2b': ''
          })
        }
        break
      default:
        setInputData({
          ...inputData,
          [key]: value,
        })
        break
    }
  }

  const calculate = () => {
    const result = inputData['1b'] / inputData['2b']
    handleInputData('3', result.toPrecision(2).toString())
  }

  const getData = async () => {
    setLoading(true)
    setError(null)
  
    try {
      const numeratorData = await axios.get('http://med.netsermon.com/api/numerator/read.php')
      setNumerators(numeratorData.data.records)

      const denominatorData = await axios.get('http://med.netsermon.com/api/denominator/read.php')
      setDenominators(denominatorData.data.records)

      const numkeys = numeratorData.data.records.map(record => parseInt(record.key))
      const denkeys = denominatorData.data.records.map(record => parseInt(record.key))

      setRange({
        num: [Math.min(...numkeys), Math.max(...numkeys)],
        den: [Math.min(...denkeys), Math.max(...denkeys)],
      })
    } catch (err) {
      console.log(err)

      setError('Something went wrong. Please try again')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      {loading
        ? (
          <ActivityIndicator
            color="#333"
            animating
            size="large"
          />
        ) : (
          <KeyboardAvoidingView
            style={styles.content}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
          >
            <View>
              <Text style={styles.title}>P/F Ratio</Text>
              <Text style={styles.error}>{error}</Text>
            </View>
            <View style={styles.grid}>
              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.colText}>SpO2:</Text>
                </View>
                <View style={styles.col}>
                  <TextInput
                    style={styles.colInput}
                    value={inputData['1a']}
                    onChangeText={(val) => handleInputData('1a', val)}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.col}>
                  <TextInput
                    style={styles.colInput}
                    value={inputData['1b']}
                    // onChangeText={(val) => handleInputData('1b', val)}
                    editable={false}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.colText}>O2 Flow:</Text>
                </View>
                <View style={styles.col}>
                  <TextInput
                    style={styles.colInput}
                    value={inputData['2a']}
                    onChangeText={(val) => handleInputData('2a', val)}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.col}>
                  <TextInput
                    style={styles.colInput}
                    value={inputData['2b']}
                    // onChangeText={(val) => handleInputData('2b', val)}
                    editable={false}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={{ ...styles.col, width: '66%' }}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={calculate}
                    disabled={!(inputData['1b'] !== '' && inputData['2b'] !== '')}
                  >
                    <Text style={styles.colText}>Calculate</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.col}>
                  <TextInput
                    style={styles.colInput}
                    value={inputData['3']}
                    // onChangeText={(val) => handleInputData('3', val)}
                    editable={false}
                  />
                </View>
              </View>
            </View>
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Oxygen flow calculator helps you evaluate the oxygen meter number in your system
              </Text>
            </View>
          </KeyboardAvoidingView>
        )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  content: {
    width: '100%',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    color: '#333',
  },
  error: {
    color: '#961010',
    marginVertical: 25,
    fontSize: 18,
  },
  grid: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  col: {
    width: '30%',
  },
  colText: {
    color: '#333',
    fontSize: 22,
  },
  colInput: {
    width: '100%',
    height: 40,
    backgroundColor: '#ccc',
    color: '#333',
    textAlign: 'center',
  },
  button: {
    height: 40,
    width: '100%',
    backgroundColor: '#0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    marginTop: 50,
  },
  footerText: {
    color: '#333',
    fontSize: 22,
  }
})

export default Main
