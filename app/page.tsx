"use client";
import { Fragment, useState } from "react";
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

const navigation = [
	{ name: "Dashboard", href: "#", icon: HomeIcon, current: true },
	{ name: "Team", href: "#", icon: UsersIcon, current: false },
	{ name: "Projects", href: "#", icon: FolderIcon, current: false },
	{ name: "Calendar", href: "#", icon: CalendarIcon, current: false },
	{ name: "Documents", href: "#", icon: DocumentDuplicateIcon, current: false },
	{ name: "Reports", href: "#", icon: ChartPieIcon, current: false },
];
const teams = [
	{ id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
	{ id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
	{ id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];
const userNavigation = [
	{ name: "Your profile", href: "#" },
	{ name: "Sign out", href: "#" },
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

export const performance: DailyPerformance[] = [
	{
		date: "2023-05-01",
		Sales: 900.73,
		Profit: 173,
		Customers: 73,
	},
	{
		date: "2023-05-02",
		Sales: 1000.74,
		Profit: 174.6,
		Customers: 74,
	},
	{
		date: "2023-05-03",
		Sales: 1100.93,
		Profit: 293.1,
		Customers: 293,
	},
	{
		date: "2023-05-04",
		Sales: 1200.9,
		Profit: 290.2,
		Customers: 29,
	},
];

const cities = [
	{
		city: "Athens",
		rating: "2 open PR",
	},
	{
		city: "Luzern",
		rating: "1 open PR",
	},
	{
		city: "Zürich",
		rating: "0 open PR",
	},
	{
		city: "Vienna",
		rating: "1 open PR",
	},
	{
		city: "Ermatingen",
		rating: "0 open PR",
	},
	{
		city: "Lisbon",
		rating: "0 open PR",
	},
	{
		city: "Athens",
		rating: "2 open PR",
	},
	{
		city: "Luzern",
		rating: "1 open PR",
	},
	{
		city: "Zürich",
		rating: "0 open PR",
	},
	{
		city: "Vienna",
		rating: "1 open PR",
	},
	{
		city: "Ermatingen",
		rating: "0 open PR",
	},
	{
		city: "Lisbon",
		rating: "0 open PR",
	},
	{
		city: "Athens",
		rating: "2 open PR",
	},
	{
		city: "Luzern",
		rating: "1 open PR",
	},
	{
		city: "Zürich",
		rating: "0 open PR",
	},
	{
		city: "Vienna",
		rating: "1 open PR",
	},
	{
		city: "Ermatingen",
		rating: "0 open PR",
	},
	{
		city: "Lisbon",
		rating: "0 open PR",
	},
	{
		city: "Athens",
		rating: "2 open PR",
	},
	{
		city: "Luzern",
		rating: "1 open PR",
	},
	{
		city: "Zürich",
		rating: "0 open PR",
	},
	{
		city: "Vienna",
		rating: "1 open PR",
	},
	{
		city: "Ermatingen",
		rating: "0 open PR",
	},
	{
		city: "Lisbon",
		rating: "0 open PR",
	},
];

export default () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const [selectedIndex, setSelectedIndex] = useState(0);
	const selectedKpi = kpiList[selectedIndex];

	const areaChartArgs = {
		className: "mt-5 h-72",
		data: performance,
		index: "date",
		categories: [selectedKpi],
		colors: ["blue"] as Color[],
		showLegend: false,
		valueFormatter: formatters[selectedKpi],
		yAxisWidth: 56,
	};

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
												src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
												alt="Your Company"
											/>
										</div>
										<nav className="flex flex-1 flex-col">
											<ul role="list" className="flex flex-1 flex-col gap-y-7">
												<li>
													<ul role="list" className="-mx-2 space-y-1">
														{navigation.map((item) => (
															<li key={item.name}>
																<a
																	href={item.href}
																	className={classNames(
																		item.current
																			? "bg-gray-50 text-indigo-600"
																			: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
																		"group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
																	)}>
																	<item.icon
																		className={classNames(
																			item.current
																				? "text-indigo-600"
																				: "text-gray-400 group-hover:text-indigo-600",
																			"h-6 w-6 shrink-0"
																		)}
																		aria-hidden="true"
																	/>
																	{item.name}
																</a>
															</li>
														))}
													</ul>
												</li>
												<li>
													<div className="text-xs font-semibold leading-6 text-gray-400">
														Your teams
													</div>
													<ul role="list" className="-mx-2 mt-2 space-y-1">
														{teams.map((team) => (
															<li key={team.name}>
																<a
																	href={team.href}
																	className={classNames(
																		team.current
																			? "bg-gray-50 text-indigo-600"
																			: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
																		"group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
																	)}>
																	<span
																		className={classNames(
																			team.current
																				? "text-indigo-600 border-indigo-600"
																				: "text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600",
																			"flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white"
																		)}>
																		{team.initial}
																	</span>
																	<span className="truncate">{team.name}</span>
																</a>
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
								className="h-8 w-auto"
								src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
								alt="Your Company"
							/>
						</div>
						<nav className="flex flex-1 flex-col">
							<ul role="list" className="flex flex-1 flex-col gap-y-7">
								<li>
									<ul role="list" className="-mx-2 space-y-1">
										{navigation.map((item) => (
											<li key={item.name}>
												<a
													href={item.href}
													className={classNames(
														item.current
															? "bg-gray-50 text-indigo-600"
															: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
														"group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
													)}>
													<item.icon
														className={classNames(
															item.current
																? "text-indigo-600"
																: "text-gray-400 group-hover:text-indigo-600",
															"h-6 w-6 shrink-0"
														)}
														aria-hidden="true"
													/>
													{item.name}
												</a>
											</li>
										))}
									</ul>
								</li>
								<li>
									<div className="text-xs font-semibold leading-6 text-gray-400">
										Your teams
									</div>
									<ul role="list" className="-mx-2 mt-2 space-y-1">
										{teams.map((team) => (
											<li key={team.name}>
												<a
													href={team.href}
													className={classNames(
														team.current
															? "bg-gray-50 text-indigo-600"
															: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
														"group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
													)}>
													<span
														className={classNames(
															team.current
																? "text-indigo-600 border-indigo-600"
																: "text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600",
															"flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white"
														)}>
														{team.initial}
													</span>
													<span className="truncate">{team.name}</span>
												</a>
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
							<div className="flex items-center gap-x-4 lg:gap-x-6">
								{/* Elements on the right end of the Header go here */}
							</div>
						</div>
					</div>

					<main className="py-6">
						<div className="px-4 sm:px-6 lg:px-8 lg:flex lg:flex-1">
							<Card className="min-w-md overflow-auto md:max-w-none md:my-4 lg:min-h-[780px] lg:max-h-[780px] lg:mx-4 lg:max-w-xl">
								<h1 className="text-2xl mb-6">Trades</h1>
								<List>
									{cities.map((item) => (
										<ListItem key={item.city}>
											<span>{item.city}</span>
											<span>{item.rating}</span>
											<span>{item.rating}</span>
											<span>{item.rating}</span>
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
												<h1 className="  text-2xl">Performance History</h1>
												<Icon
													icon={InformationCircleIcon}
													variant="simple"
													tooltip="Shows daily increase or decrease of particular domain"
												/>
											</Flex>
											<Text> Daily change per domain </Text>
										</div>
										<div>
											<TabGroup
												index={selectedIndex}
												onIndexChange={setSelectedIndex}>
												<TabList color="gray" variant="solid">
													<Tab>Sales</Tab>
													<Tab>Profit</Tab>
													<Tab>Customers</Tab>
												</TabList>
											</TabGroup>
										</div>
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
									<h1 className="mb-3">Performance</h1>
									<Flex className="flex-row">
										{/* <Metric>{performanceFormatter(calcPerformanceNumbers())}</Metric> */}
										<Metric>
											$ 34,743
											{/* {performanceFormatter(performanceNumbers[timeframe])} */}
										</Metric>
										<BadgeDelta
											deltaType="increase"
											// deltaType={
											// 	performance[timeframe] >= 0 ? "increase" : "decrease"
											// }
										>
											12%
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
