import React, { useEffect, useState } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highmaps';
import worldMap from '@highcharts/map-collection/custom/world.geo.json';
import { useRouter } from 'next/navigation';
import mapDataContinents from '@highcharts/map-collection/custom/world-continents.geo.json';

const regionsData = {
  Europe: ['de', 'fr', 'gb', 'it', 'es', 'nl', 'se', 'no', 'fi', 'dk'],
  'Central America and the Caribbean': [
    'cu',
    'jm',
    'ht',
    'do',
    'cr',
    'ni',
    'sv',
    'gt',
    'hn',
    'pa',
    'bz',
  ],
  'South America': [
    'br',
    'ar',
    'cl',
    'pe',
    'co',
    've',
    'bo',
    'py',
    'uy',
    'gf',
    'sr',
  ],
  'North America': ['us', 'ca', 'mx'],
  Asia: [
    'cn',
    'in',
    'jp',
    'kr',
    'id',
    'ph',
    'vn',
    'th',
    'my',
    'sg',
    'hk',
    'tw',
  ],
  Africa: ['eg', 'za', 'ng', 'ke', 'ma', 'dz', 'et', 'gh', 'cm', 'ci', 'tn'],
};

const mapData = Object.keys(regionsData).reduce((acc, region) => {
  Object.values(regionsData[region]).forEach((countryCode) => {
    acc.push([countryCode, 1]); // Set a uniform value or replace with null
  });
  return acc;
}, []);

export const LineChart = () => {
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [chartHeight, setChartHeight] = useState(600); // Default height

  const createSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleClick = (event) => {
    const regionName = event.point.name;
    const regionSlug = createSlug(regionName);
    setSelectedRegion(regionName);
    router.push(`explore/geography?q=${regionSlug}`);
  };

  const [options, setOptions] = useState({});

  useEffect(() => {
    const updateChartHeight = () => {
      // Adjust the height based on the screen width
      const width = window.innerWidth;
      
      if (width >= 3500) {
        setChartHeight(1600); // Small screen height
      } else if (width < 3500 && width >= 2560) {
        setChartHeight(800); // Medium screen height
      }
      else if (width < 2560 && width >= 1024) {
        setChartHeight(500); // Medium screen height
      }else if (width < 1024 && width >= 991) {
        setChartHeight(400); // Medium screen height
      } else {
        setChartHeight(400); // Large screen height
      }
    };

    updateChartHeight(); // Set initial height
    window.addEventListener('resize', updateChartHeight); // Update on resize

    return () => window.removeEventListener('resize', updateChartHeight);
  }, []);

  useEffect(() => {
    // Map each feature to a Highcharts-compatible format
    const data = mapDataContinents.features.map((feature, index) => ({
      key: index, // Assign a unique key for each feature
      name: feature.properties.name, // Use appropriate property name
      value: Math.random(),
      color: '#E4ECFB',
    }));

    setOptions({
      chart: {
        map: mapDataContinents,
        backgroundColor: '#fff',
        height: chartHeight, // Dynamically set height
      },
      title: {
        text: null,
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: 'bottom',
        },
      },
      tooltip: {
        formatter: function () {
          return `<b>${this.point.name}</b>`;
        },
      },
      plotOptions: {
        series: {
          point: {
            events: {
              click: handleClick,
            },
          },
        },
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          type: 'map',
          name: 'Continents',
          mapData: mapDataContinents,
          data,
          dataLabels: {
            enabled: true,
            format: '{point.name}',
          },
          states: {
            hover: {
              color: '#6C8ED9',
              borderColor: '#6C8ED9',
            },
          },
          joinBy: null,
        },
      ],
    });
  }, [chartHeight]);

  return (
    <div className='md:block hidden'>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        constructorType={'mapChart'}
      />
      {selectedRegion && <p>Selected Region: {selectedRegion}</p>}
    </div>
  );
};
