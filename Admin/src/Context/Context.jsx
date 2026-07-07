import { createContext, useState } from 'react';

export const DataContext = createContext();

const Context = (props) => {
	const [searchBar, setSearchBar] = useState(false);
	const [userInput, setUserInput] = useState('');
	const [slider, setSlider] = useState(false);
	const currency = '₹';
	const value = {
		userInput,
		setUserInput,
		searchBar,
		setSearchBar,
		slider,
		setSlider,
		currency,
	};
	return (
		<DataContext.Provider value={value}>{props.children}</DataContext.Provider>
	);
};
export default Context;
