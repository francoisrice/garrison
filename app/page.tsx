"use client";
import { Fragment, useState } from "react";
import useSWR, { mutate } from "swr";
import {
	Flex,
	Title,
	Icon,
	TabGroup,
	TabList,
	Tab,
	AreaChart,
	Text,
	Color,
	Card,
	List,
	ListItem,
	Metric,
	BadgeDelta,
} from "@tremor/react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
	Bars3Icon,
	BellIcon,
	CalendarIcon,
	ChartPieIcon,
	Cog6ToothIcon,
	DocumentDuplicateIcon,
	FolderIcon,
	HomeIcon,
	UsersIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import {
	ChevronDownIcon,
	MagnifyingGlassIcon,
	InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface Trade {
	exitDatetime: Date;
	entryDatetime: Date;
	mode: string;
	entryPrice: number;
	entryAmountUSD: number;
	profitAbsolute: number;
	exitPrice: number;
	algo: string;
	_id: string;
	profitPercent: number;
}

// TODO: Pull list of algos from the DB automatically
const navigation = [
	{
		_id: 1,
		name: "New Monthly High",
		algo: "new-monthly-high-1mon-btc-v0_1",
		href: "#",
		current: true,
	},
	{
		_id: 2,
		name: "3 MA Crossover",
		algo: "3-ma-cross-30min-btc-v0_1",
		href: "#",
		current: false,
	},
	{
		_id: 3,
		name: "BB Reversal 1min",
		algo: "bb-reversal-1min-btc-v0_1",
		href: "#",
		current: false,
	},
	{
		_id: 4,
		name: "Armor Plated",
		algo: "option-wheel-1w-btc",
		href: "#",
		current: false,
	},
];

const algorithmList = [
	"",
	"new-monthly-high-1mon-btc-v0_1",
	"3-ma-cross-30m-BTC-v0_1",
	"bb-reversal-1min-btc-v0_1",
	"option-wheel-1w-btc",
	"btc-chimera-total",
	"'new-monthly-high-1mon-btc-chimera-v0_1'",
	"'bb-reversal-1min-btc-chimera-v0_1'",
];

const btcChimeraAlgos = [
	{
		_id: 5,
		name: "Total",
		algo: "new-monthly-high-1mon-btc-chimera-v0_1",
		href: "#",
		current: false,
	},
	{
		_id: 6,
		name: "New Monthly High",
		algo: "new-monthly-high-1mon-btc-chimera-v0_1",
		href: "#",
		current: false,
	},
	{
		_id: 7,
		name: "BB Reversal 1min",
		algo: "bb-reversal-1min-btc-chimera-v0_1",
		href: "#",
		current: false,
	},
];

function classNames(...classes: any) {
	return classes.filter(Boolean).join(" ");
}

const usNumberformatter = (number: number, decimals = 0) =>
	Intl.NumberFormat("us", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	})
		.format(Number(number))
		.toString();

const formatters: { [key: string]: any } = {
	Sales: (number: number) => `$ ${usNumberformatter(number)}`,
	Profit: (number: number) => `$ ${usNumberformatter(number)}`,
	Customers: (number: number) => `${usNumberformatter(number)}`,
	Delta: (number: number) => `${usNumberformatter(number, 2)}%`,
};

const Kpis = {
	Sales: "Sales",
	Profit: "Profit",
	Customers: "Customers",
};

const kpiList = [Kpis.Sales, Kpis.Profit, Kpis.Customers];

export type DailyPerformance = {
	date: string;
	Sales: number;
	Profit: number;
	Customers: number;
};

const fetcher = ([url, algo]: [string, string]) =>
	fetch(url, {
		method: "POST",
		body: JSON.stringify({
			algo,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	}).then((res) => res.json());

const rollingAggregator = (data: Trade[]) => {
	var newData: any = [];
	// if (data?.length == 0) {
	const rollingAggregator = data.reduce(
		(acc: any, trade: Trade) => {
			const { profitAbsolute, exitPrice, entryPrice } = trade;
			acc.profitAbsolute += profitAbsolute;
			acc.profitPercent += exitPrice / entryPrice - 1;
			newData.push({ ...acc });
			return acc;
		},
		{ profitAbsolute: 0, profitPercent: 0 }
	);
	// }
	// console.log(newData);
	return newData;
};

const isSearchEnabled = () => {
	const searchFeatureFlag = process.env.PUBLIC_SEARCH_ENABLED;
	if (
		searchFeatureFlag?.toUpperCase().includes("T") ||
		searchFeatureFlag?.toUpperCase().includes("Y")
	) {
		return true;
	}
	return false;
};

export default () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [selectedAlgo, setSelectedAlgo] = useState(1);

	const [selectedIndex, setSelectedIndex] = useState(0);
	const selectedKpi = kpiList[selectedIndex];

	const { data, error, isLoading, mutate } = useSWR(
		["/api/", algorithmList[selectedAlgo]],
		fetcher
	);

	const handleSidebar = async (selectedAlgo: number) => {
		setSelectedAlgo(selectedAlgo);

		mutate();
		totalProfit = rollingAggregator(data).reverse()[0];
		reverseData = data.reverse();
	};

	if (error) return <div>failed to load</div>;
	if (isLoading) return <div>Loading...</div>;

	const areaChartArgs = {
		className: "mt-5 h-72",
		// data: performance,
		data: rollingAggregator(data),
		index: "exitDatetime",
		// categories: [selectedKpi],
		categories: ["profitAbsolute"],
		colors: ["blue"] as Color[],
		showLegend: false,
		valueFormatter: formatters[selectedKpi],
		yAxisWidth: 56,
	};

	// Because .reverse() mutates `data`, order matters here
	var totalProfit = rollingAggregator(data).reverse()[0];
	var reverseData = data?.reverse();

	return (
		<>
			{/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
			<div>
				<Transition.Root show={sidebarOpen} as={Fragment}>
					<Dialog
						as="div"
						className="relative z-50 lg:hidden"
						onClose={setSidebarOpen}>
						<Transition.Child
							as={Fragment}
							enter="transition-opacity ease-linear duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="transition-opacity ease-linear duration-300"
							leaveFrom="opacity-100"
							leaveTo="opacity-0">
							<div className="fixed inset-0 bg-gray-900/80" />
						</Transition.Child>

						<div className="fixed inset-0 flex">
							<Transition.Child
								as={Fragment}
								enter="transition ease-in-out duration-300 transform"
								enterFrom="-translate-x-full"
								enterTo="translate-x-0"
								leave="transition ease-in-out duration-300 transform"
								leaveFrom="translate-x-0"
								leaveTo="-translate-x-full">
								<Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
									<Transition.Child
										as={Fragment}
										enter="ease-in-out duration-300"
										enterFrom="opacity-0"
										enterTo="opacity-100"
										leave="ease-in-out duration-300"
										leaveFrom="opacity-100"
										leaveTo="opacity-0">
										<div className="absolute left-full top-0 flex w-16 justify-center pt-5">
											<button
												type="button"
												className="-m-2.5 p-2.5"
												onClick={() => setSidebarOpen(false)}>
												<span className="sr-only">Close sidebar</span>
												<XMarkIcon
													className="h-6 w-6 text-white"
													aria-hidden="true"
												/>
											</button>
										</div>
									</Transition.Child>
									{/* Sidebar component, swap this element with another sidebar if you like */}
									<div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
										<div className="flex h-16 shrink-0 items-center">
											<img
												className="h-8 w-auto"
												src="Sureshot-final_RGB-b.png"
												alt="Sureshot"
											/>
										</div>
										<nav className="flex flex-1 flex-col">
											<ul role="list" className="flex flex-1 flex-col gap-y-7">
												<li>
													<ul role="list" className="-mx-2 space-y-1">
														{navigation.map((item) => (
															<li key={item.name}>
																<div
																	onClick={() => handleSidebar(item._id)}
																	className={classNames(
																		item._id == selectedAlgo
																			? "bg-gray-50 text-indigo-600"
																			: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
																		"group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
																	)}>
																	{item.name}
																</div>
															</li>
														))}
													</ul>
												</li>
												<li>
													<div className="text-lg font-semibold leading-6">
														BTC Chimera
													</div>
													<ul role="list" className="-mx-2 mt-2 space-y-1">
														{btcChimeraAlgos.map((algo) => (
															<li key={algo.name}>
																<div
																	onClick={() => handleSidebar(algo._id)}
																	className={classNames(
																		algo._id == selectedAlgo
																			? "bg-gray-50 text-indigo-600"
																			: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
																		"group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
																	)}>
																	<span>{/* {team.initial} */}</span>
																	<span className="truncate">{algo.name}</span>
																</div>
															</li>
														))}
													</ul>
												</li>
												<li className="mt-auto">
													<a
														href="#"
														className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
														<Cog6ToothIcon
															className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
															aria-hidden="true"
														/>
														Settings
													</a>
												</li>
											</ul>
										</nav>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</Dialog>
				</Transition.Root>

				{/* Static sidebar for desktop */}
				<div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
					{/* Sidebar component, swap this element with another sidebar if you like */}
					<div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
						<div className="flex h-16 shrink-0 items-center">
							<img
								className="h-10 w-auto"
								src="Sureshot-final_RGB-b.png"
								alt="Sureshot Capital"
							/>
						</div>
						<nav className="flex flex-1 flex-col">
							<ul role="list" className="flex flex-1 flex-col gap-y-7">
								<li>
									<ul role="list" className="-mx-2 space-y-1">
										{navigation.map((item) => (
											<li key={item.name}>
												<div
													onClick={() => handleSidebar(item._id)}
													className={classNames(
														item._id == selectedAlgo
															? "bg-gray-50 text-indigo-600"
															: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
														"group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
													)}>
													{item.name}
												</div>
											</li>
										))}
									</ul>
								</li>
								<li>
									<div className="text-xl leading-6 text-black">
										BTC Chimera
									</div>
									<ul role="list" className="-mx-2 mt-2 space-y-1">
										{btcChimeraAlgos.map((algo) => (
											<li key={algo.name}>
												<div
													onClick={() => handleSidebar(algo._id)}
													className={classNames(
														algo._id == selectedAlgo
															? "bg-gray-50 text-indigo-600"
															: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
														"group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
													)}>
													<span>{/* small spacing before algo name */}</span>
													<span className="truncate">{algo.name}</span>
												</div>
											</li>
										))}
									</ul>
								</li>
								<li className="mt-auto">
									<a
										href="#"
										className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
										<Cog6ToothIcon
											className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
											aria-hidden="true"
										/>
										Settings
									</a>
								</li>
							</ul>
						</nav>
					</div>
				</div>

				<div className="lg:pl-72">
					<div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
						<button
							type="button"
							className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
							onClick={() => setSidebarOpen(true)}>
							<span className="sr-only">Open sidebar</span>
							<Bars3Icon className="h-6 w-6" aria-hidden="true" />
						</button>

						{/* Separator */}
						<div
							className="h-6 w-px bg-gray-200 lg:hidden"
							aria-hidden="true"
						/>

						<div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
							{isSearchEnabled() && (
								<form className="relative flex flex-1" action="#" method="GET">
									<label htmlFor="search-field" className="sr-only">
										Search
									</label>
									<MagnifyingGlassIcon
										className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
										aria-hidden="true"
									/>
									<input
										id="search-field"
										className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
										placeholder="Search..."
										type="search"
										name="search"
									/>
								</form>
							)}
							<div className="flex items-center gap-x-4 lg:gap-x-6">
								{/* Elements on the right end of the Header go here */}
								{/* TODO: Add Toggle to only show live trades */}
							</div>
						</div>
					</div>

					<main className="bg-gray-100 py-6">
						<div className="px-4 sm:px-6 lg:px-8 lg:flex lg:flex-1">
							<Card className="min-w-md overflow-auto md:max-w-none md:my-4 lg:min-h-[780px] lg:max-h-[780px] lg:mx-4 lg:max-w-xl">
								<h1 className="text-black text-2xl mb-6">Trades</h1>
								{/* TODO: Add column headers to Trades */}
								<List>
									{reverseData.map((trade: Trade) => (
										<ListItem
											key={trade.exitDatetime.toString()}
											className="text-black">
											{/* TODO: Add Date formatter & maybe entryDatetime */}
											<span>{trade.exitDatetime.toString()}</span>
											{/* TODO: Add Price formatter */}
											<span>{trade.entryPrice.toString()}</span>
											<span>{trade.exitPrice.toString()}</span>
											<span>
												{(
													(trade.exitPrice / trade.entryPrice - 1) *
													100
												).toFixed(2)}
												%
											</span>
										</ListItem>
									))}
								</List>
							</Card>

							<div>
								<Card className="md:my-4 lg:mx-4 lg:h-[450px] lg:max-w-[930px]">
									<div className="md:flex justify-between">
										<div>
											<Flex
												className="space-x-0.5"
												justifyContent="start"
												alignItems="center">
												<h1 className="text-black text-2xl">
													Performance History
												</h1>
												{/* <Icon
													icon={InformationCircleIcon}
													variant="simple"
													tooltip="Shows daily increase or decrease of particular domain"
												/> */}
											</Flex>
											<Text> Daily change per domain </Text>
										</div>
										{/* TODO: Allow for dynamic timeframe selection */}
										{/* TODO: Create Toggle to show dollars '$' or percent '%'*/}
										{/* <div>
											<TabGroup
												index={selectedIndex}
												onIndexChange={setSelectedIndex}>
												<TabList color="gray" variant="solid">
													<Tab>Sales</Tab>
													<Tab>Profit</Tab>
													<Tab>Customers</Tab>
												</TabList>
											</TabGroup>
										</div> */}
									</div>
									{/* web */}
									<div className="mt-8 hidden sm:block">
										<AreaChart {...areaChartArgs} />
									</div>
									{/* mobile */}
									<div className="mt-8 sm:hidden">
										<AreaChart
											{...areaChartArgs}
											startEndOnly={true}
											showGradient={false}
											showYAxis={false}
										/>
									</div>
								</Card>

								<Card className="max-w-xs mx-auto mt-10">
									<h1 className="text-black mb-3">Performance</h1>
									<Flex className="flex-row">
										{/* <Metric>{performanceFormatter(calcPerformanceNumbers())}</Metric> */}
										<Metric>
											{/* $ 34,743 */}
											{/* TODO: Add dollar formatter  */}
											{totalProfit?.profitAbsolute}
										</Metric>
										<BadgeDelta
											// deltaType="increase"
											deltaType={
												// rollingAggregator(data).reverse()[0] &&
												// rollingAggregator(data).reverse()[0].profitPercent *
												// 	100
												totalProfit?.profitPercent * 100 >= 0
													? "increase"
													: "decrease"
											}>
											{/* 12% */}
											{/* {rollingAggregator(data).reverse()[0] &&
												(
													rollingAggregator(data).reverse()[0].profitPercent *
													100
												).toFixed(2)} */}
											{(totalProfit?.profitPercent * 100).toFixed(2)}%
											{/* {percentageFormatter(performance[timeframe])} */}
										</BadgeDelta>
									</Flex>
								</Card>
							</div>
						</div>
					</main>
				</div>
			</div>
		</>
	);
};
