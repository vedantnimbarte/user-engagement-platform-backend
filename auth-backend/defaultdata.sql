SET session_replication_role = replica;

INSERT INTO public.attribute_group 
(attribute_group_id, attribute_group, attribute_group_key, status, created_at, created_by) 
VALUES 
(1, 'Browser Attributes', 'browser_attributes', 1, NOW(), NULL),
(2, 'Nps', 'nps', 1, NOW(), NULL),
(3, 'Checklist', 'checklist', 1, NOW(), NULL),
(4, 'Product Tour', 'product_tour', 1, NOW(), NULL),
(5, 'Custom', 'custom', 1, NOW(), NULL);

INSERT INTO public.condition_group 
(condition_group_id, condition_group, description, status, created_at, created_by) 
VALUES 
(1, 'String Operators', 'String Operator condition Group', 1, NOW(), NULL),
(2, 'Date Operators', 'Date Operators Group', 1, NOW(), NULL),
(3, 'List Operators', 'List Operators Group', 1, NOW(), NULL),
(4, 'Number Operators', 'Number Operators Group', 1, NOW(), NULL),
(5, 'Boolean Operators', 'Boolean Operators Group', 1, NOW(), NULL),
(8, 'Segment Operators', 'Segment Operators Group', 1, NOW(), NULL);

INSERT INTO public.conditions 
(condition_id, condition_group_id, condition_name, symbol, script, status, created_at, created_by) 
VALUES 
(1, 1, 'Equals', NULL, NULL, 1, NOW(), NULL),
(2, 1, 'Doesn''t equal', NULL, NULL, 1, NOW(), NULL),
(3, 1, 'Contains', NULL, NULL, 1, NOW(), NULL),
(4, 1, 'Doesn''t contain', NULL, NULL, 1, NOW(), NULL),
(5, 1, 'Starts with', NULL, NULL, 1, NOW(), NULL),
(6, 1, 'Doesn''t start with', NULL, NULL, 1, NOW(), NULL),
(7, 1, 'Ends with', NULL, NULL, 1, NOW(), NULL),
(8, 1, 'Doesn''t end with', NULL, NULL, 1, NOW(), NULL),
(13, 2, 'More than', NULL, NULL, 1, NOW(), NULL),
(14, 2, 'Less than', NULL, NULL, 1, NOW(), NULL),
(15, 2, 'After', NULL, NULL, 1, NOW(), NULL),
(16, 2, 'Before', NULL, NULL, 1, NOW(), NULL),
(17, 2, 'On', NULL, NULL, 1, NOW(), NULL),
(18, 3, 'Is one of', NULL, NULL, 1, NOW(), NULL),
(19, 3, 'Is not one of', NULL, NULL, 1, NOW(), NULL),
(20, 4, 'Greater than or equal to', NULL, NULL, 1, NOW(), NULL),
(21, 4, 'Less than or equal to', NULL, NULL, 1, NOW(), NULL),
(22, 4, 'Equals', NULL, NULL, 1, NOW(), NULL),
(23, 4, 'Doesn''t equal', NULL, NULL, 1, NOW(), NULL),
(24, 5, 'Is true', NULL, NULL, 1, NOW(), NULL),
(25, 5, 'Is false', NULL, NULL, 1, NOW(), NULL);

INSERT INTO public.data_type 
(data_type_id, data_type, data_type_key, description, status, created_at, created_by) 
VALUES 
(1, 'Text', 'string', 'String', 1, NOW(), NULL),
(2, 'Number', 'number', 'Number', 1, NOW(), NULL),
(3, 'True/False', 'boolean', 'Boolean', 1, NOW(), NULL),
(4, 'DateTime', 'date', 'Date', 1, NOW(), NULL),
(5, 'List', 'list', 'List', 1, NOW(), NULL);

INSERT INTO public.display_frequency 
(display_frequency_id, display_frequency_type, status, created_at, created_by)
VALUES 
(1, 'all the time', 1, NOW(), NULL),
(2, 'show once', 1, NOW(), NULL);

INSERT INTO public.display_trigger 
(display_trigger_id, display_trigger_type, status, created_at, created_by)
VALUES 
(1, 'Scroll percentage', 1, NOW(), NULL),
(2, 'Exit intent', 1, NOW(), NULL),
(3, 'Delay', 1, NOW(), NULL);

INSERT INTO public.events 
(event_id, event_name, event_type)
VALUES 
('17ddd4fe-ced2-4178-9ad9-adcfef45ed5a', 'page_view', 'system'),
('9f549f32-0710-468c-b2f4-77441fb70ed0', 'ul_checklist_item_completed', 'system'),
('0f7239dc-db9b-4d81-952a-cf2f51f5f64e', 'ul_checklist_dismissed', 'system'),
('2a44fe50-dda8-4b36-a549-bd6436430f2c', 'ul_checklist_completed', 'system'),
('5aeaa144-191d-442c-962f-6567e0ffc4a1', 'ul_checklist_triggered', 'system');

INSERT INTO public.fonts 
(font_id, font_name, status, created_at, created_by)
VALUES 
(1, 'Courier New', 1, NOW(), NULL),
(2, 'Courier', 1, NOW(), NULL),
(3, 'monospace', 1, NOW(), NULL),
(4, 'Franklin Gothic Medium', 1, NOW(), NULL),
(5, 'Arial Narrow', 1, NOW(), NULL);

INSERT INTO public.positions 
(position_id, position_name, status, created_at, created_by)
VALUES 
(1, 'Top Left', 1, NOW(), NULL),
(2, 'Top Right', 1, NOW(), NULL),
(3, 'Bottom Left', 1, NOW(), NULL),
(4, 'Bottom Right', 1, NOW(), NULL);

INSERT INTO public.device_type
(device_type_id, device_type_name, status, created_at, created_by)
VALUES 
(1, 'Desktop', 1, NOW(), NULL),
(2, 'Mobile', 1, NOW(), NULL),
(3, 'Tablet', 1, NOW(), NULL);

INSERT INTO public.browser
(browser_id, browser_name, status, created_at, created_by)
VALUES 
(1, 'MS Edge', 1, NOW(), NULL),
(2, 'Edge (chromium based)', 1, NOW(), NULL),
(3, 'Chrome', 1, NOW(), NULL),
(4, 'MS IE', 1, NOW(), NULL),
(5, 'Opera', 1, NOW(), NULL);

INSERT INTO public.operating_system
(operating_system_id, operating_system_name, status, created_at, created_by)
VALUES 
(1, 'Windows', 1, NOW(), NULL),
(2, 'Mac OS', 1, NOW(), NULL),
(3, 'Linux', 1, NOW(), NULL),
(4, 'Android', 1, NOW(), NULL),
(5, 'iOS', 1, NOW(), NULL);

INSERT INTO public.ul_attribute 
(attribute_id, attribute_name, attribute_key, status, data_type_id, description, display_frequency_id, display_trigger_id, created_at, created_by, attribute_group_id)
VALUES 
(1, 'Last seen at', 'last_seen_at', 1, 4, 'first seen at time', 2, true, 1, NOW(), NULL, NULL),
(2, 'First seen at', 'first_seen_at', 1, 4, 'first seen at time', 2, true, 1, NOW(), NULL, NULL),
(3, 'Country', 'country', 1, 1, 'Country Name', 3, true, 1, NOW(), NULL, NULL),
(4, 'Region Name', 'region_name', 1, 1, 'Region Name', 1, true, 1, NOW(), NULL, NULL),
(5, 'City', 'city', 1, 1, 'City Name', 1, true, 1, NOW(), NULL, NULL);

INSERT INTO public.theme_settings (
    theme,
    is_current,
    custom_css,
    survey,
    product_tour,
    checklist,
    demoz
) VALUES 
('dark',
    false,
    '{
        "themeProperties": {
            "button_style": "Filled",
            "font_family": "Arial"
        },
        "colors": {
            "page_background_color": {"id": "page_background_color", "label": "Page background", "color": "#ecebed"},
            "background_color": {"id": "background_color", "label": "Widget background", "color": "#ffffff"},
            "primary_color": {"id": "primary_color", "label": "Primary color", "color": "#000000"},
            "secondary_color": {"id": "secondary_color", "label": "Secondary color", "color": "#646F79"},
            "primary_button": {"id": "primary_button", "label": "Primary button", "color": "#1e6de3"},
            "secondary_button": {"id": "secondary_button", "label": "Secondary button", "color": "#646F79"},
            "link_color": {"id": "link_color", "label": "Link color", "color": "#636CFB"}
        },
        "radiusProperties": {
            "model_radius": {"id": "model_radius", "label": "Model radius", "value": 6},
            "button_radius": {"id": "button_radius", "label": "Button radius", "value": 6}
        }
    }'::json,
    '{
        "npsThemeProperties": {
            "light_box_Color": "#000000",
            "nps_font_family": "Arial",
            "nps_button_style": "Filled",
            "light_box_blur": 20,
            "light_box_opacity": 0.2,
            "model_blur": 5,
            "model_opacity": 0.3
        },
        "colors": {
            "questions_color": {"id": "questions_color", "label": "Questions color", "color": "#ffffff"},
            "description_color": {"id": "description_color", "label": "Description color", "color": "#ffffff"},
            "detractor_Color": {"id": "detractor_Color", "label": "Detractor color", "color": "#FD5551"},
            "passive_color": {"id": "passive_color", "label": "Passive color", "color": "#FEBA08"},
            "promotor_color": {"id": "promotor_color", "label": "Promotor color", "color": "#09B570"},
            "background_color": {"id": "background_color", "label": "Background color", "color": "#1D1D1D"},
            "primary_button": {"id": "primary_button", "label": "Primary button", "color": "#DF1E1E"},
            "secondary_button": {"id": "secondary_button", "label": "Secondary button", "color": "#D4D8D8"},
            "link_color": {"id": "link_color", "label": "Link color", "color": "#636CFB"},
            "dismiss_color": {"id": "dismiss_color", "label": "Dismiss color", "color": "#FF4706"}
        },
        "blurProperties": {
            "light_box_opacity": {"id": "light_box_opacity", "label": "Backdrop opacity", "value": 18}
        },
        "image": "/temporaryImages/20230103T110750083Z391592.png"
    }'::json,
    '{
        "productTour": {
            "product_tour_button_style": "Outline / Filled",
            "product_tour_font_family": "Arial",
            "light_box_Color": "#000000"
        },
        "colors": {
            "title_color": {"id": "title_color", "label": "Title color", "color": "#FFFFFF"},
            "description_color": {"id": "description_color", "label": "Description color", "color": "#FDFDFD"},
            "background_color": {"id": "background_color", "label": "Background color", "color": "#000000"},
            "primary_color": {"id": "primary_color", "label": "Primary button", "color": "#5D6468"},
            "secondary_button": {"id": "secondary_button", "label": "Secondary button", "color": "#dfdfdf"},
            "link_color": {"id": "link_color", "label": "Link color", "color": "#636CFB"},
            "dismiss_button": {"id": "dismiss_button", "label": "Dismiss color", "color": "#ffffff"}
        },
        "blurProperties": {
            "light_box_opacity": {"id": "light_box_opacity", "label": "Backdrop opacity", "value": 18}
        },
        "image": "/temporaryImages/20230103T110916950Z575801.jpg"
    }'::json,
    '{
        "boxColor": {
            "progress_outer_color": "#979797",
            "progress_inner_color": "#ffffff",
            "check_box_fill_color": "#fdfdfd",
            "check_box_unfill_color": "#B4B4B4",
            "preview_background": "#c9c9c9",
            "checklist_button_style": "Filled",
            "checklist_font_family": "Arial"
        },
        "colors": {
            "title_color": {"id": "title_color", "label": "Title color", "color": "rgba(255,255,255,1)"},
            "content_color": {"id": "content_color", "label": "Content color", "color": "#E6E6E6"},
            "background_color": {"id": "background_color", "label": "Background color", "color": "rgba(0,0,0,1)"},
            "primary_color": {"id": "primary_color", "label": "Primary button", "color": "rgba(5,5,5,1)"},
            "secondary_button": {"id": "secondary_button", "label": "Secondary button", "color": "rgba(52,53,56,1)"},
            "link_color": {"id": "link_color", "label": "Link color", "color": "#636CFB"},
            "dismiss_button": {"id": "dismiss_button", "label": "Dismiss color", "color": "#646F79"}
        }
    }'::json,
    '{
        "otherStyles": {
            "demox_button_radius": 30,
            "demox_font_family": "Arial",
            "demox_browser": "safari",
            "demox_browser_theme": "dark"
        },
        "colors": {
            "background_color": {"id": "background_color", "label": "Background color", "color": "#000000"},
            "primary_color": {"id": "primary_color", "label": "Primary button", "color": "#1e6de3"},
            "text_color": {"id": "text_color", "label": "Text color", "color": "#ffffff"},
            "hotspot_color": {"id": "hotspot_color", "label": "Hotspot color", "color": "#8D8D8D"}
        }
    }'::json),
    ('light',
    true,
    '{
        "themeProperties": {
            "button_style": "Filled",
            "font_family": "Arial"
        },
        "colors": {
            "page_background_color": {"id": "page_background_color", "label": "Page background", "color": "#ecebed"},
            "background_color": {"id": "background_color", "label": "Widget background", "color": "#ffffff"},
            "primary_color": {"id": "primary_color", "label": "Primary color", "color": "#000000"},
            "secondary_color": {"id": "secondary_color", "label": "Secondary color", "color": "#646F79"},
            "primary_button": {"id": "primary_button", "label": "Primary button", "color": "#1e6de3"},
            "secondary_button": {"id": "secondary_button", "label": "Secondary button", "color": "#646F79"},
            "link_color": {"id": "link_color", "label": "Link color", "color": "#1e6de3"}
        },
        "radiusProperties": {
            "model_radius": {"id": "model_radius", "label": "Model radius", "value": 6},
            "button_radius": {"id": "button_radius", "label": "Button radius", "value": 6}
        }
    }'::json,
    '{
        "npsThemeProperties": {
            "nps_font_family": "Arial",
            "nps_button_style": "Outline / Filled",
            "light_box_Color": "#000000"
        },
        "colors": {
            "questions_color": {"id": "questions_color", "label": "Questions color", "color": "#000000"},
            "description_color": {"id": "description_color", "label": "Description color", "color": "#646f79"},
            "detractor_Color": {"id": "detractor_Color", "label": "Detractor color", "color": "#f10404"},
            "passive_color": {"id": "passive_color", "label": "Passive color", "color": "#FEBA08"},
            "promotor_color": {"id": "promotor_color", "label": "Promotor color", "color": "#09B570"},
            "background_color": {"id": "background_color", "label": "Background color", "color": "#ffffff"},
            "primary_button": {"id": "primary_button", "label": "Primary button", "color": "#1e6de3"},
            "secondary_button": {"id": "secondary_button", "label": "Secondary button", "color": "#646F79"},
            "link_color": {"id": "link_color", "label": "Link color", "color": "#1e6de3"},
            "dismiss_color": {"id": "dismiss_color", "label": "Dismiss color", "color": "#646F79"}
        },
        "blurProperties": {
            "light_box_opacity": {"id": "light_box_opacity", "label": "Backdrop opacity", "value": 25}
        },
        "image": "/temporaryImages/20230103T062315741Z577236.jpg"
    }'::json,
    '{
        "productTour": {
            "light_box_Color": "#000000",
            "product_tour_button_style": "Outline / Filled",
            "product_tour_font_family": "Arial"
        },
        "colors": {
            "title_color": {"id": "title_color", "label": "Title color", "color": "rgba(0,0,0,1)"},
            "description_color": {"id": "description_color", "label": "Description color", "color": "#646f79"},
            "background_color": {"id": "background_color", "label": "Background color", "color": "#FFFFFF"},
            "primary_color": {"id": "primary_color", "label": "Primary button", "color": "#1e6de3"},
            "secondary_button": {"id": "secondary_button", "label": "Secondary button", "color": "#423D3D"},
            "link_color": {"id": "link_color", "label": "Link color", "color": "#1e6de3"},
            "dismiss_button": {"id": "dismiss_button", "label": "Dismiss color", "color": "#000000"}
        },
        "blurProperties": {
            "light_box_opacity": {"id": "light_box_opacity", "label": "Backdrop opacity", "value": 18}
        },
        "image": "/temporaryImages/20230103T062514508Z755404.jpg"
    }'::json,
    '{
        "boxColor": {
            "progress_outer_color": "#dcdafc",
            "progress_inner_color": "#7ed321",
            "check_box_fill_color": "#1e6de3",
            "check_box_unfill_color": "#bfeaff",
            "preview_background": "#ecebed",
            "checklist_button_style": "Filled",
            "checklist_font_family": "Arial"
        },
        "colors": {
            "title_color": {"id": "title_color", "label": "Title color", "color": "#ffffff"},
            "content_color": {"id": "content_color", "label": "Content color", "color": "#000000"},
            "background_color": {"id": "background_color", "label": "Background color", "color": "#FFFFFF"},
            "primary_color": {"id": "primary_color", "label": "Primary button", "color": "#1e6de3"},
            "secondary_button": {"id": "secondary_button", "label": "Secondary button", "color": "#8EA0B6"},
            "link_color": {"id": "link_color", "label": "Link color", "color": "#1e6de3"},
            "dismiss_button": {"id": "dismiss_button", "label": "Dismiss color", "color": "#63819C"}
        }
    }'::json,
    '{
        "otherStyles": {
            "demox_button_radius": 30,
            "demox_font_family": "Arial",
            "demox_browser": "safari",
            "demox_browser_theme": "light"
        },
        "colors": {
            "background_color": {"id": "background_color", "label": "Background color", "color": "#f8f8f8"},
            "primary_color": {"id": "primary_color", "label": "Primary button", "color": "#00abff"},
            "text_color": {"id": "text_color", "label": "Text color", "color": "#646f79"},
            "hotspot_color": {"id": "hotspot_color", "label": "Hotspot color", "color": "#646f79"}
        }
    }'::json);

SET session_replication_role = DEFAULT;