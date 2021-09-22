module.exports = function(sequelize, DataTypes) {
    var Campaign = sequelize.define('Campaign', {
        name: DataTypes.STRING
    });

    Campaign.associate = function(models) {
        Campaign.hasMany(models.Character)
    }

    return Campaign
}