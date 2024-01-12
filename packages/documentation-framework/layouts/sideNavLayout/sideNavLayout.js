import React, { useEffect, useState, createContext } from 'react';
import {
  Button,
  Page,
  PageSidebar,
  PageSidebarBody,
  Brand,
  Dropdown,
  DropdownItem,
  DropdownGroup,
  DropdownList,
  Divider,
  Icon,
  Masthead,
  MastheadToggle,
  MastheadMain,
  MastheadContent,
  MastheadBrand,
  MenuToggle,
  PageToggleButton,
  Toolbar,
  ToolbarGroup,
  ToolbarContent,
  ToolbarItem,
  SkipToContent,
  Switch,
  SearchInput,
  ToggleGroup,
  ToggleGroupItem
} from '@patternfly/react-core';
import BarsIcon from '@patternfly/react-icons/dist/esm/icons/bars-icon';
import GithubIcon from '@patternfly/react-icons/dist/esm/icons/github-icon';
import MoonIcon from '@patternfly/react-icons/dist/esm/icons/moon-icon';
import SunIcon from '@patternfly/react-icons/dist/esm/icons/sun-icon';
import { SideNav, TopNav, GdprBanner } from '../../components';
import staticVersions from '../../versions.json';
import v5Logo from '../PF-HorizontalLogo-Reverse.svg';

export const RtlContext = createContext(false);

const HeaderTools = ({
  versions,
  hasVersionSwitcher,
  algolia,
  hasDarkThemeSwitcher,
  hasRTLSwitcher,
  topNavItems,
  isRTL,
  setIsRTL
}) => {
  const initialVersion = staticVersions.Releases.find(release => release.latest);
  const latestVersion = versions.Releases.find(version => version.latest);
  const previousReleases = Object.values(versions.Releases).filter(version => !version.hidden && !version.latest);
  const hasSearch = algolia;
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const getDropdownItem = (version, isLatest = false) => (
    <DropdownItem itemId={version.name} key={version.name} to={isLatest ? '/' : `/${version.name}`}>
      {`Release ${version.name}`}
    </DropdownItem>
  );

  const onChange = (_evt, value) => {
    setSearchValue(value);
  };

  const onToggleExpand = (_evt, isSearchExpanded) => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  const toggleDarkTheme = (_evt, selected) => {
    const darkThemeToggleClicked = !selected === isDarkTheme
    document.querySelector('html').classList.toggle('pf-v5-theme-dark', darkThemeToggleClicked);
    setIsDarkTheme(darkThemeToggleClicked);
  };

  useEffect(() => {
    // reattach algolia to input each time search is expanded
    if (hasSearch && isSearchExpanded) {
      attachDocSearch(algolia, '.ws-global-search .pf-v5-c-text-input-group__text-input', 1000);
    }
  }, [isSearchExpanded])

  return (
    <Toolbar isFullHeight>
      <ToolbarContent>
        {topNavItems.length > 0 && (
          <ToolbarItem className="pf-m-overflow-container">
            <TopNav navItems={topNavItems} />
          </ToolbarItem>
        )}
        <ToolbarGroup
          align={{ default: 'alignRight' }}
          spaceItems={{ default: 'spacerNone', md: 'spacerMd' }}
        >
          {hasDarkThemeSwitcher && (
            <ToolbarItem>
                <ToggleGroup aria-label="Dark theme toggle group">
                  <ToggleGroupItem aria-label="light theme toggle" icon={<Icon size="md"><SunIcon /></Icon>} isSelected={!isDarkTheme} onChange={toggleDarkTheme} />
                  <ToggleGroupItem aria-label="dark theme toggle" icon={<Icon size="md"><MoonIcon /></Icon>} isSelected={isDarkTheme} onChange={toggleDarkTheme} />
                </ToggleGroup>
            </ToolbarItem>
          )}
          {hasRTLSwitcher && (
            <ToolbarItem>
              <Switch id="ws-rtl-switch" label={'RTL'} defaultChecked={isRTL} onChange={() => setIsRTL(isRTL => !isRTL)} />
            </ToolbarItem>
          )}
          {hasSearch && (
            <ToolbarItem>
              <SearchInput
                className="ws-global-search"
                placeholder="Search"
                value={searchValue}
                onChange={onChange}
                onClear={(_evt) => onChange(_evt, '')}
                expandableInput={{ isExpanded: isSearchExpanded, onToggleExpand, toggleAriaLabel: 'Expandable search input toggle' }}
              />
            </ToolbarItem>
          )}
          <ToolbarItem>
            <Button
              component="a"
              variant="plain"
              href="//github.com/patternfly"
              target="top"
              aria-label="PatternFly GitHub page"
            >
              <GithubIcon />
            </Button>
          </ToolbarItem>
          {hasVersionSwitcher && (
            <ToolbarItem>
              <Dropdown
                onSelect={() => setDropdownOpen(!isDropdownOpen)}
                onOpenChange={(isOpen) => setDropdownOpen(isOpen)}
                isOpen={isDropdownOpen}
                toggle={(toggleRef) => (
                  <MenuToggle
                    isFullHeight
                    ref={toggleRef}
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                    isExpanded={isDropdownOpen}
                  >
                    Release {initialVersion.name}
                  </MenuToggle>
                )}
              >
                <DropdownGroup key="Latest" label="Latest">
                  <DropdownList>
                    {getDropdownItem(latestVersion, true)}
                  </DropdownList>
                </DropdownGroup>
                {previousReleases.length > 0 && (
                  <DropdownGroup key="Previous releases" label="Previous releases">
                    <DropdownList>
                      {previousReleases
                        .slice(0,3)
                        .map(version => getDropdownItem(version))}
                    </DropdownList>
                  </DropdownGroup>
                )}
                <Divider key="divider" className="ws-switcher-divider"/>
                <DropdownGroup key="Previous versions" label="Previous versions">
                  <DropdownList>
                    <DropdownItem
                      key="PatternFly 4"
                      className="ws-patternfly-3"
                      isExternalLink
                      to="http://v4-archive.patternfly.org/v4/"
                      itemId="patternfly-4"
                    >
                      PatternFly 4
                    </DropdownItem>
                    <DropdownItem
                      key="PatternFly 3"
                      className="ws-patternfly-3"
                      isExternalLink
                      to="https://pf3.patternfly.org/"
                      itemId="patternfly-3"
                    >
                      PatternFly 3
                    </DropdownItem>
                  </DropdownList>
                </DropdownGroup>
              </Dropdown>
            </ToolbarItem>
          )}
        </ToolbarGroup></ToolbarContent>
    </Toolbar>
  );
}

// https://github.com/algolia/autocomplete.js#global-options
export function attachDocSearch(algolia, inputSelector, timeout) {
  if (window.docsearch) {
    return window.docsearch({
      inputSelector,
      autocompleteOptions: {
        hint: false,
        appendTo: `.ws-global-search .pf-v5-c-text-input-group`,
      },
      debug: process.env.NODE_ENV !== 'production',
      ...algolia
    });
  }
  else {
    setTimeout(() => attachDocSearch(algolia, inputSelector, timeout), timeout);
  }
}

export const SideNavLayout = ({ children, groupedRoutes, navOpen: navOpenProp }) => {
  const algolia = process.env.algolia;
  const hasGdprBanner = process.env.hasGdprBanner;
  const hasVersionSwitcher = process.env.hasVersionSwitcher;
  const hasDarkThemeSwitcher = process.env.hasDarkThemeSwitcher;
  const hasRTLSwitcher = process.env.hasRTLSwitcher;
  const sideNavItems = process.env.sideNavItems;
  const topNavItems = process.env.topNavItems;
  const prnum = process.env.prnum;
  const prurl = process.env.prurl;

  const [versions, setVersions] = useState({ ...staticVersions });
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (hasVersionSwitcher && window.fetch) {
      fetch('/versions.json').then(res => {
        if (res.ok) {
          res.json().then(json => setVersions(json));
        }
      });
    }
  }, []);

  const SideBar = (
    <PageSidebar
      className="ws-page-sidebar"
      theme="light"
    >
      <PageSidebarBody>
        <SideNav navItems={sideNavItems} groupedRoutes={groupedRoutes} />
      </PageSidebarBody>
    </PageSidebar>
  );

  const Header = (
    <Masthead className="ws-masthead">
      <MastheadToggle>
        <PageToggleButton variant="plain" aria-label="Global navigation">
          <BarsIcon />
        </PageToggleButton>
      </MastheadToggle>
      <MastheadMain>
        <MastheadBrand href={prurl || '/'}>
          {prnum ? `PR #${prnum}` : (
            <svg height="40px" viewBox="0 0 679 158">
              <title>PF-HorizontalLogo-Color</title>
              <defs>
                <linearGradient x1="68%" y1="2.25860997e-13%" x2="32%" y2="100%" id="linearGradient-website-masthead">
                  <stop stopColor="#2B9AF3" offset="0%"></stop>
                  <stop stopColor="#73BCF7" stopOpacity="0.502212631" offset="100%"></stop>
                </linearGradient>
              </defs>
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g transform="translate(206.000000, 45.750000)" fill="var(--pf-t--global--text--color--regular)" fillRule="nonzero">
                  <path d="M0,65.25 L0,2.25 L33.21,2.25 C37.35,2.25 41.025,3.135 44.235,4.905 C47.445,6.675 49.98,9.09 51.84,12.15 C53.7,15.21 54.63,18.72 54.63,22.68 C54.63,26.46 53.7,29.865 51.84,32.895 C49.98,35.925 47.43,38.31 44.19,40.05 C40.95,41.79 37.29,42.66 33.21,42.66 L15.48,42.66 L15.48,65.25 L0,65.25 Z M15.48,29.88 L31.41,29.88 C33.69,29.88 35.52,29.22 36.9,27.9 C38.28,26.58 38.97,24.87 38.97,22.77 C38.97,20.61 38.28,18.855 36.9,17.505 C35.52,16.155 33.69,15.48 31.41,15.48 L15.48,15.48 L15.48,29.88 Z"></path>
                  <path d="M77.04,66.06 C73.68,66.06 70.695,65.43 68.085,64.17 C65.475,62.91 63.435,61.17 61.965,58.95 C60.495,56.73 59.76,54.18 59.76,51.3 C59.76,46.74 61.485,43.215 64.935,40.725 C68.385,38.235 73.2,36.99 79.38,36.99 C83.1,36.99 86.7,37.44 90.18,38.34 L90.18,36 C90.18,31.26 87.15,28.89 81.09,28.89 C77.49,28.89 72.69,30.15 66.69,32.67 L61.47,21.96 C69.15,18.48 76.56,16.74 83.7,16.74 C90.3,16.74 95.43,18.315 99.09,21.465 C102.75,24.615 104.58,29.04 104.58,34.74 L104.58,65.25 L90.18,65.25 L90.18,62.37 C88.26,63.69 86.235,64.635 84.105,65.205 C81.975,65.775 79.62,66.06 77.04,66.06 Z M73.62,51.03 C73.62,52.53 74.28,53.7 75.6,54.54 C76.92,55.38 78.75,55.8 81.09,55.8 C84.69,55.8 87.72,55.05 90.18,53.55 L90.18,47.43 C87.42,46.71 84.54,46.35 81.54,46.35 C79.02,46.35 77.07,46.755 75.69,47.565 C74.31,48.375 73.62,49.53 73.62,51.03 Z"></path>
                  <path d="M137.25,65.88 C125.73,65.88 119.97,60.84 119.97,50.76 L119.97,29.79 L110.34,29.79 L110.34,17.64 L119.97,17.64 L119.97,5.4 L134.55,2.25 L134.55,17.64 L147.87,17.64 L147.87,29.79 L134.55,29.79 L134.55,47.88 C134.55,49.98 135.015,51.465 135.945,52.335 C136.875,53.205 138.51,53.64 140.85,53.64 C143.01,53.64 145.2,53.31 147.42,52.65 L147.42,64.44 C146.1,64.86 144.42,65.205 142.38,65.475 C140.34,65.745 138.63,65.88 137.25,65.88 Z"></path>
                  <path d="M177.57,65.88 C166.05,65.88 160.29,60.84 160.29,50.76 L160.29,29.79 L150.66,29.79 L150.66,17.64 L160.29,17.64 L160.29,5.4 L174.87,2.25 L174.87,17.64 L188.19,17.64 L188.19,29.79 L174.87,29.79 L174.87,47.88 C174.87,49.98 175.335,51.465 176.265,52.335 C177.195,53.205 178.83,53.64 181.17,53.64 C183.33,53.64 185.52,53.31 187.74,52.65 L187.74,64.44 C186.42,64.86 184.74,65.205 182.7,65.475 C180.66,65.745 178.95,65.88 177.57,65.88 Z"></path>
                  <path d="M217.62,66.15 C212.76,66.15 208.365,65.055 204.435,62.865 C200.505,60.675 197.4,57.72 195.12,54 C192.84,50.28 191.7,46.11 191.7,41.49 C191.7,36.87 192.795,32.7 194.985,28.98 C197.175,25.26 200.16,22.305 203.94,20.115 C207.72,17.925 211.92,16.83 216.54,16.83 C221.22,16.83 225.36,17.955 228.96,20.205 C232.56,22.455 235.395,25.53 237.465,29.43 C239.535,33.33 240.57,37.8 240.57,42.84 L240.57,46.44 L206.64,46.44 C207.6,48.66 209.1,50.475 211.14,51.885 C213.18,53.295 215.58,54 218.34,54 C222.42,54 225.6,52.8 227.88,50.4 L237.51,58.95 C234.51,61.47 231.435,63.3 228.285,64.44 C225.135,65.58 221.58,66.15 217.62,66.15 Z M206.37,36.27 L226.26,36.27 C225.48,33.99 224.205,32.16 222.435,30.78 C220.665,29.4 218.61,28.71 216.27,28.71 C213.87,28.71 211.8,29.37 210.06,30.69 C208.32,32.01 207.09,33.87 206.37,36.27 Z"></path>
                  <path d="M247.41,65.25 L247.41,17.64 L261.99,17.64 L261.99,22.41 C265.23,18.51 269.4,16.56 274.5,16.56 C277.08,16.62 278.91,17.01 279.99,17.73 L279.99,30.42 C277.95,29.46 275.64,28.98 273.06,28.98 C270.78,28.98 268.665,29.505 266.715,30.555 C264.765,31.605 263.19,33.09 261.99,35.01 L261.99,65.25 L247.41,65.25 Z"></path>
                  <path d="M286.29,65.25 L286.29,17.64 L300.87,17.64 L300.87,20.88 C304.47,18.12 308.73,16.74 313.65,16.74 C317.37,16.74 320.655,17.55 323.505,19.17 C326.355,20.79 328.59,23.04 330.21,25.92 C331.83,28.8 332.64,32.13 332.64,35.91 L332.64,65.25 L318.06,65.25 L318.06,37.89 C318.06,35.25 317.28,33.15 315.72,31.59 C314.16,30.03 312.06,29.25 309.42,29.25 C305.76,29.25 302.91,30.51 300.87,33.03 L300.87,65.25 L286.29,65.25 Z"></path>
                  <polygon points="342 65.25 342 2.25 392.04 2.25 392.04 15.66 357.48 15.66 357.48 27.45 380.52 27.45 380.52 40.41 357.48 40.41 357.48 65.25"></polygon>
                  <polygon points="399.96 65.25 399.96 2.25 414.54 0 414.54 65.25"></polygon>
                  <path d="M429.21,84.69 C428.07,84.69 426.96,84.645 425.88,84.555 C424.8,84.465 423.9,84.33 423.18,84.15 L423.18,71.73 C424.38,71.97 425.88,72.09 427.68,72.09 C432.36,72.09 435.51,70.05 437.13,65.97 L437.13,65.88 L418.86,17.64 L434.97,17.64 L445.5,47.61 L457.74,17.64 L473.49,17.64 L452.16,67.68 C450.42,71.82 448.5,75.135 446.4,77.625 C444.3,80.115 441.87,81.915 439.11,83.025 C436.35,84.135 433.05,84.69 429.21,84.69 Z"></path>
                </g>
                <g transform="translate(0.000000, 0.000000)">
                  <path d="M61.826087,0 L158,0 L158,96.173913 L147.695652,96.173913 C100.271201,96.173913 61.826087,57.7287992 61.826087,10.3043478 L61.826087,0 L61.826087,0 Z" fill={var(--pf-t--color--blue--50)}></path>
                  <path d="M158,3.43478261 L65.2608696,158 L138,158 C149.045695,158 158,149.045695 158,138 L158,3.43478261 L158,3.43478261 Z" fill="url(#linearGradient-website-masthead)"></path>
                  <path d="M123.652174,-30.9130435 L30.9130435,123.652174 L103.652174,123.652174 C114.697869,123.652174 123.652174,114.697869 123.652174,103.652174 L123.652174,-30.9130435 L123.652174,-30.9130435 Z" fill="url(#linearGradient-website-masthead)" transform="translate(77.282609, 46.369565) scale(1, -1) rotate(90.000000) translate(-77.282609, -46.369565) "></path>
                </g>
              </g>
            </svg>
          )}
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        {(algolia || hasVersionSwitcher) && (
          <HeaderTools
            versions={versions}
            algolia={algolia}
            hasVersionSwitcher={hasVersionSwitcher}
            hasDarkThemeSwitcher={hasDarkThemeSwitcher}
            hasRTLSwitcher={hasRTLSwitcher}
            topNavItems={topNavItems}
            isRTL={isRTL}
            setIsRTL={setIsRTL}
          />
        )}
      </MastheadContent>
    </Masthead>
  )

  return (
    <React.Fragment>
      <RtlContext.Provider value={ isRTL }>
        <Page
          id="ws-page"
          mainContainerId="ws-page-main"
          header={Header}
          sidebar={SideBar}
          skipToContent={<SkipToContent href="#ws-page-main">Skip to content</SkipToContent>}
          isManagedSidebar
          defaultManagedSidebarIsOpen={navOpenProp}
        >
          {children}
        </Page>
        <div id="ws-page-banners">
          {hasGdprBanner && <GdprBanner />}
        </div>
      </RtlContext.Provider>
    </React.Fragment>
  );
}
