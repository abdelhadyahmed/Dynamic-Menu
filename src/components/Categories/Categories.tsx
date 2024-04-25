import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  cover: string;
}

const CategoriesComponent: React.FC = () => {
  const menuImageRef = useRef<HTMLImageElement>(null);
  const menuItemRef = useRef<HTMLDivElement>(null);
  const [menuTilte, setMenuTitle] = useState<string>("");
  const [slogan, setSlogan] = useState<string>("");
  const [cover, setCover] = useState<string>("");
  const [imageHeight, setImageHeight] = useState<number>();
  const [menuItemsHeight, setMenuItemsHeight] = useState<number>();
  const [menuSingleItemHeight, setMenuSingleItemHeight] = useState<number>();
  const [numberOfPages, setNumberOfPages] = useState<number>();
  const [numberOfItemsPerPage, setNumberOfItemsPerPage] = useState<number>(0);
  const [menu, setMenu] = useState<Menu | undefined>();
  const navigate = useNavigate();

  const getDate = async () => {
    const res = await fetch(`http://localhost:3333/menu`);
    const menu: Menu = await res.json();
    setMenu(menu);
    setMenuTitle(menu.name);
    setSlogan(menu.slogan);
    setCover(menu.cover);
  }

  useEffect(() => {
    getDate();
  }, []);

  useEffect(() => {
    if (menuImageRef.current) {
      const handleImageLoad = () => {
        const imageHeightDOM = menuImageRef.current?.clientHeight;
        setImageHeight(imageHeightDOM);
      };

      menuImageRef.current?.addEventListener('load', handleImageLoad);

      return () => {
        menuImageRef.current?.removeEventListener('load', handleImageLoad);
      };
    }
  }, []);

  useEffect(() => {
    console.log("useEffect 3 triggered");
    if (menuItemRef.current && menu?.categories) {
      const menuItemHeight = menuItemRef.current.clientHeight;
      setMenuItemsHeight((((menuItemHeight + 10) * menu.categories.length) + 200));
      setMenuSingleItemHeight(menuItemHeight + 10 + 200 / menu.categories.length);
    }
  }, [menu]);

  useEffect(() => {
    if (imageHeight && menuItemsHeight && menuSingleItemHeight) {

      const pages = Math.ceil(menuItemsHeight / imageHeight);
      setNumberOfPages(pages);
      const itemsPerPage = Math.floor(imageHeight / menuSingleItemHeight);
      setNumberOfItemsPerPage(itemsPerPage);
    }
  }, [imageHeight, menuItemsHeight, menuSingleItemHeight]);

  const categoryHanlleClick = (id: number) => {
    navigate(`/items/${id}`);
  }

  return (
    <div className="menu-page-pdf">
      
      {<div className="menu-page-content">
        <div className="background-image" >
          <img ref={menuImageRef} src={cover} alt="" />
        </div>
      </div>}
      {
        menu?.categories ? (
          <>
            {[...Array(numberOfPages)].map((_, pageIndex) => {
              const startIndex = pageIndex * numberOfItemsPerPage;
              const endIndex = Math.min(startIndex + numberOfItemsPerPage, menu.categories.length);
              const categoryItems = menu.categories.slice(startIndex, endIndex);

              return (
                <div key={pageIndex} className="menu-page-content">
                  <div className="background-image" >
                    <img ref={menuImageRef} src={cover} alt="" />
                  </div>
                  <div className="menu-items">
                    {categoryItems.length ? (
                      <div className="items-content">
                        {pageIndex === 0 && (
                          <div className='menuTitle'>
                            <h1 className='title'>{menuTilte}</h1>
                            <h3 className='slogan'>{slogan}</h3>
                          </div>
                        )}
                        {categoryItems.map((category, itemIndex) => (
                          <div key={itemIndex} className="menu-item" ref={menuItemRef}>
                            <div className="menu-category-name">
                              <p onClick={() => categoryHanlleClick(category.id)}>{category.name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="items-content">
                        {menu.categories.map((menuItem, itemIndex) => (
                          <div key={itemIndex} className="menu-item" ref={menuItemRef}>
                            <div className="menu-category-name">{menuItem.name}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div>Loading...</div>
        )
      }
    </div>
  );
};

export default CategoriesComponent;
