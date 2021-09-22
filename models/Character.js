module.exports = function(sequelize, DataTypes) {
    var Character = sequelize.define('Character', {
        name: DataTypes.STRING,
        player: DataTypes.STRING,
    })

    Character.associate = function(models) {
        Character.belongsTo(models.Campaign);
        Character.belongsTo(models.User);
    }

    return Character;
}