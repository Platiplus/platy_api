class Utils {
  chaoticInputGenerator (target) {
    var properties = Object.keys(target)
    delete target[properties[properties.length * Math.random() << 0]]
    return target
  }
}

module.exports = Utils
