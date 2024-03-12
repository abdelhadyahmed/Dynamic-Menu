
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import data from '../../server.json'; // change this to backend Api
import './index.css';
interface Category {
  id: number;
  name: string;
  items: MenuItem[];
}

interface MenuItem {
  name: string;
  description: string;
}

interface Menu {
  id: number;
  name: string;
  slogan: string;
  categories: Category[];
}

interface Props {
  menu: Menu;
}

const CategoriesComponent : React.FC = () => {
  const menuImageRef = useRef<HTMLImageElement>(null);
  const menuItemRef = useRef<HTMLDivElement>(null);
  const [imageHeight, setImageHeight] = useState<number>();
  const [menuItemsHeight, setMenuItemsHeight] = useState<number>();
  const [menuSingleItemHeight, setMenuSingleItemHeight] = useState<number>();
  const [numberOfPages, setNumberOfPages] = useState<number>();
  const [numberOfItemsPerPage, setNumberOfItemsPerPage] = useState<number>(0);
  const [menu, setMenu] = useState<Menu>(data.menu);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (menuImageRef.current) {
      const handleImageLoad = () => {
        const imageHeightDOM = menuImageRef.current?.clientHeight;
        setImageHeight(imageHeightDOM);
      };

      menuImageRef.current.addEventListener('load', handleImageLoad);

      return () => {
        if (menuImageRef.current) {
          menuImageRef.current.removeEventListener('load', handleImageLoad);
        }
      };
    }
  }, []);

  useEffect(() => {
    if (menuItemRef.current) {
      const menuItemHeight = menuItemRef.current.clientHeight;
      setMenuItemsHeight((((menuItemHeight as number + 10) * menu.categories.length) + 200));
      setMenuSingleItemHeight(menuItemHeight as number + 10 + 200 / menu.categories.length);
      console.log('Menu items height:', menuItemHeight);
    }
  }, []);

  useEffect(() => {
    if (Math.ceil((menuItemsHeight as number) / (imageHeight as number)))
      setNumberOfPages(Math.ceil((menuItemsHeight as number) / (imageHeight as number)))
    if (menuSingleItemHeight)
      setNumberOfItemsPerPage(Math.floor((imageHeight as number) / (menuSingleItemHeight as number)))
  }, [imageHeight, menuItemsHeight, menuSingleItemHeight])

  console.log((imageHeight as number), menuItemsHeight, menuSingleItemHeight, numberOfItemsPerPage, (menuItemsHeight as number) / (imageHeight as number), numberOfPages)


  const categoryHanlleClick = (id: number) => {
    navigate(`/items/${id}`);
  }

  return (
    <div className="menu-page-pdf">
      {[...Array(numberOfPages)].map((_, pageIndex) => {
        const startIndex = pageIndex * numberOfItemsPerPage;
        const endIndex = Math.min(startIndex + numberOfItemsPerPage, menu.categories.length);
        const categoryItems = menu.categories.slice(startIndex, endIndex);

        return <div key={pageIndex} className="menu-page-content">
          <div className="background-image" >
            <img ref={menuImageRef} src="./assets/images/demoPhoto.jpeg" alt="" />
          </div>
          <div className="menu-items">
            {categoryItems.length ? <div className="items-content">
              {categoryItems?.map((category, itemIndex) => {
                return <div key={itemIndex} className="menu-item" ref={menuItemRef}>
                  <div className="menu-category-name">
                    <p onClick={() => categoryHanlleClick(category.id)}>{category.name}</p>
                  </div>
                </div>
              })}
            </div>
              :
              <div className="items-content">
                {menu.categories?.map((menuItem, itemIndex) => {
                  return <div key={itemIndex} className="menu-item" ref={menuItemRef}>
                    <div className="menu-category-name">{menuItem.name}</div>
                  </div>
                })}
              </div>}
          </div>
        </div>
      })}
    </div>
  );
};

export default CategoriesComponent;