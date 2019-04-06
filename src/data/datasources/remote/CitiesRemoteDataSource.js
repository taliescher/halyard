import implement from 'implement-js'
import RestNetworkClient from '../../apiclients/RestNetworkClient'
import CitiesDataSource from '../../protocols/CitiesDataSource'
import ApiConstants from '../../constants/ApiConstants'
import RequestType from '../../helpers/RequestType'
import CitiesResponseParameters from '../../helpers/CitiesResponseParameters'
import LocationResponseParameters from '../../helpers/LocationResponseParameters'
import City from '../../models/City';
import Location from '../../models/Location';

const CitiesRemoteDataSource = implement(CitiesDataSource)({
    async cities(citiesFilter) {
        const citiesUrl = `${ApiConstants.corsProxyUrl}${ApiConstants.baseUrl}${ApiConstants.citiesEndpoint}`;
        const parameters = {
            offset: citiesFilter.offset,
            rows: citiesFilter.rows,
            extras: "location"
        }
        const auth = ApiConstants.authentication;
        const citiesResponse = await RestNetworkClient.performRequest(citiesUrl, RequestType.get, parameters, {}, auth)
            .catch(error => {
                handleError(error);
                return [];
            });
        const citiesData = citiesResponse.data.result;
        const cities = citiesData.map(city => {
            return parseCityData(city);
        });
        return cities;
    }
});

const parseCityData = cityData => {
    if (cityData) {
        const country = cityData[CitiesResponseParameters.country];
        const cityId = cityData[CitiesResponseParameters.cityId];
        const location = parseLocation(cityData[CitiesResponseParameters.location]);
        const numberOfHotels = cityData[CitiesResponseParameters.numberOfHotels];
        const name = cityData[CitiesResponseParameters.name];
        return new City(country, cityId, location, numberOfHotels, name);
    }
    return null;
};

const parseLocation = locationData => {
    if (locationData) {
        const latitude = locationData[LocationResponseParameters.latitude];
        const longitude = locationData[LocationResponseParameters.longitude];
        return new Location(latitude, longitude);
    }
    return null;
}

const handleError = error => {
    console.warn(error);
    return null;
};

export default CitiesRemoteDataSource;