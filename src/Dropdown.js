import React, {Component, useState} from "react";

export const Dropdown = ({values, parentCallback}) => {
	const [curr, setCurr] = useState(values[0]);
	var optList = [];

	for (var i = 0; i < values.length;i++){
		optList.push(<option value = {values[i]}>{values[i]}</option>);
	}

	return(
		<label>
			Select Bin Range:
			<select onChange={(e)=>{
				setCurr(e.target.value);
				parentCallback(e.target.value);
			}}>
				{optList}
			</select>
		</label>
	);
};