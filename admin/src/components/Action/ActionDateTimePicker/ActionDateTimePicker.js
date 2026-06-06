import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { DateTimePicker, Typography, Stack } from '@strapi/design-system';
import { getTrad } from '../../../utils/getTrad';
import { useSettings } from '../../../hooks/useSettings';

import './ActionDateTimerPicker.css';

const parseDate = (value) => {
	if (!value) {
		return null;
	}

	const date = value instanceof Date ? value : new Date(value);

	return Number.isNaN(date.getTime()) ? null : date;
};

const toPickerDate = (value) => {
	const date = parseDate(value);

	if (!date) {
		return null;
	}

	return new Date(
		date.getUTCFullYear(),
		date.getUTCMonth(),
		date.getUTCDate(),
		date.getUTCHours(),
		date.getUTCMinutes(),
		date.getUTCSeconds(),
		date.getUTCMilliseconds()
	);
};

const toServerDateTime = (value) => {
	const date = parseDate(value);

	if (!date) {
		return null;
	}

	return new Date(
		Date.UTC(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			date.getHours(),
			date.getMinutes(),
			date.getSeconds(),
			date.getMilliseconds()
		)
	).toISOString();
};

const ActionDateTimePicker = ({ executeAt, mode, isCreating, isEditing, onChange }) => {
	const { formatMessage, locale: browserLocale } = useIntl();
	const [locale, setLocale] = useState(browserLocale);
	const [step, setStep] = useState(1);
	const { getSettings } = useSettings();

	function handleDateChange(date) {
		if (onChange) {
			onChange(toServerDateTime(date));
		}
	}

	const { isLoading, data, isRefetching } = getSettings();

	useEffect(() => {
		if (!isLoading && !isRefetching) {
			if (data) {
				setStep(data.components.dateTimePicker.step);

				const customLocale = data.components.dateTimePicker.locale;
				try {
					Intl.DateTimeFormat(customLocale);
					setLocale(customLocale);
				} catch (error) {
					console.log(
						`'${customLocale}' is not a valid format, using browser locale: '${browserLocale}'`
					);
				}
			}
		}
	}, [isLoading, isRefetching]);

	if (!isCreating && !isEditing) {
		return null;
	}

	return (
		<div id="action-date-time-picker">
			<Stack spacing={2}>
				<Typography variant="sigma" textColor="neutral600" merginBottom={1}>
					{formatMessage({
						id: getTrad(`action.header.${mode}.title`),
						defaultMessage: `${mode} Date`,
					})}
				</Typography>
				<DateTimePicker
					ariaLabel="datetime picker"
					onChange={handleDateChange}
					value={toPickerDate(executeAt)}
					disabled={!isCreating}
					step={step}
					locale={locale}
				/>
			</Stack>
		</div>
	);
};

ActionDateTimePicker.propTypes = {
	executeAt: PropTypes.string,
	onChange: PropTypes.func,
	mode: PropTypes.string.isRequired,
	isCreating: PropTypes.bool.isRequired,
	isEditing: PropTypes.bool.isRequired,
};

export default ActionDateTimePicker;
