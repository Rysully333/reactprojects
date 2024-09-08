//fxn that will convert fahrenheit to celsius
const fahrenheitToCelsius = (fahrenheit) => {
  return (fahrenheit - 32) * 5 / 9;
}

const celsiusToFahrenheit = (celsius) => {
  return (celsius * 9 / 5) + 32;
}

//fahrenheit to Kelvin function
const fahrenheitToKelvin = (fahrenheit) => {
  return (fahrenheit + 459.67) * 5 / 9;
}

//celsius to Kelvin function
const celsiusToKelvin = (celsius) => {
  return celsius + 273.15;
}

//Kelvin to Fahrenheit function
const kelvinToFahrenheit = (kelvin) => {
  return (kelvin * 9 / 5) - 459.67;
}

//Kelvin to Celsius function
const kelvinToCelsius = (kelvin) => {
  return kelvin - 273.15;
}

module.exports = {
  fahrenheitToCelsius,
  celsiusToFahrenheit,
  fahrenheitToKelvin,
  celsiusToKelvin,
  kelvinToFahrenheit,
  kelvinToCelsius
}